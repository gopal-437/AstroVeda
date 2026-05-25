import fs from "fs/promises";
import path from "path";

const dbPath = path.join(process.cwd(), "data", "db.json");

// Connection States
const isRedis = !!(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);

// Ensure data directory exists (local only)
async function ensureDir() {
  await fs.mkdir(path.dirname(dbPath), { recursive: true });
}

// Queue for serializing local file writes (local only)
let writeQueue = Promise.resolve();

// Read raw lists from Redis, MongoDB, or local JSON file
export async function readDb() {
  // 1. Upstash Redis (REST API - serverless safe, no dependencies)
  if (isRedis) {
    try {
      const [visitsRes, txRes] = await Promise.all([
        fetch(`${process.env.UPSTASH_REDIS_REST_URL}/lrange/visits/0/-1`, {
          headers: { Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}` },
          next: { revalidate: 0 } // Disable fetch cache
        }),
        fetch(`${process.env.UPSTASH_REDIS_REST_URL}/lrange/transactions/0/-1`, {
          headers: { Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}` },
          next: { revalidate: 0 } // Disable fetch cache
        })
      ]);

      const visitsData = await visitsRes.json();
      const txData = await txRes.json();

      const visits = (visitsData.result || []).map(v => JSON.parse(v));
      const transactions = (txData.result || []).map(t => JSON.parse(t));

      return { visits, transactions };
    } catch (err) {
      console.error("Redis fetch failure, defaulting to empty:", err);
      return { visits: [], transactions: [] };
    }
  }


  // 3. Fallback Local File Storage
  await ensureDir();
  try {
    const data = await fs.readFile(dbPath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    return { visits: [], transactions: [] };
  }
}

// Write database atomically (local only)
export async function writeDb(data) {
  await ensureDir();
  writeQueue = writeQueue.then(async () => {
    try {
      const tempPath = `${dbPath}.tmp`;
      await fs.writeFile(tempPath, JSON.stringify(data, null, 2), "utf-8");
      await fs.rename(tempPath, dbPath);
    } catch (err) {
      console.error("Atomic write failed to DB:", err);
      throw err;
    }
  });
  await writeQueue;
}

// Append a visitor log
export async function trackVisit({ eventType, moduleName, country, city, ip }) {
  const newVisit = {
    id: `v_${Math.random().toString(36).substring(2, 11)}`,
    eventType,
    moduleName: moduleName || null,
    country: country || "Unknown Country",
    city: city || "Unknown City",
    ip: ip || "Unknown IP",
    timestamp: Date.now(),
  };

  // 1. Upstash Redis
  if (isRedis) {
    try {
      await fetch(process.env.UPSTASH_REDIS_REST_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify([
          ["RPUSH", "visits", JSON.stringify(newVisit)],
          ["LTRIM", "visits", "-20000", "-1"] // cap size
        ])
      });
      return newVisit;
    } catch (err) {
      console.error("Redis log visit failure:", err);
    }
  }


  // 3. Fallback Local File
  try {
    const db = await readDb();
    db.visits.push(newVisit);
    if (db.visits.length > 20000) {
      db.visits = db.visits.slice(db.visits.length - 20000);
    }
    await writeDb(db);
    return newVisit;
  } catch (error) {
    console.error("Local file log visit failure:", error);
  }
}

// Append a transaction log
export async function recordTransaction({ orderId, paymentId, featureId, price }) {
  const newTransaction = {
    orderId,
    paymentId,
    featureId,
    price: Number(price),
    timestamp: Date.now(),
  };

  // 1. Upstash Redis
  if (isRedis) {
    try {
      await fetch(process.env.UPSTASH_REDIS_REST_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(["RPUSH", "transactions", JSON.stringify(newTransaction)])
      });
      return newTransaction;
    } catch (err) {
      console.error("Redis record tx failure:", err);
    }
  }


  // 3. Fallback Local File
  try {
    const db = await readDb();
    db.transactions.push(newTransaction);
    await writeDb(db);
    return newTransaction;
  } catch (error) {
    console.error("Local file record tx failure:", error);
  }
}

// Helper to format timestamp to YYYY-MM-DD local date
function formatDate(timestamp) {
  const d = new Date(timestamp);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// Compile metrics for admin dashboard
export async function getAnalyticsData() {
  const db = await readDb();
  
  const visits = db.visits || [];
  const transactions = db.transactions || [];

  // 1. KPI cards
  const totalRevenue = transactions.reduce((sum, tx) => sum + (tx.price || 0), 0);
  const totalVisits = visits.length;
  
  const uniqueIPs = new Set(visits.map(v => v.ip));
  const uniqueVisitors = uniqueIPs.size;

  const totalModuleInteractions = visits.filter(v => v.eventType === "module_view").length;

  // 2. Day-wise aggregation (Last 30 days)
  const dayMap = {};
  
  // Initialize last 7 days with 0s
  const now = Date.now();
  for (let i = 6; i >= 0; i--) {
    const dateStr = formatDate(now - i * 24 * 60 * 60 * 1000);
    dayMap[dateStr] = { date: dateStr, visits: 0, moduleViews: 0, revenue: 0 };
  }

  // Populate visits
  visits.forEach(v => {
    const day = formatDate(v.timestamp);
    if (!dayMap[day]) {
      dayMap[day] = { date: day, visits: 0, moduleViews: 0, revenue: 0 };
    }
    if (v.eventType === "page_view") {
      dayMap[day].visits += 1;
    } else if (v.eventType === "module_view") {
      dayMap[day].moduleViews += 1;
    }
  });

  // Populate transactions (revenue)
  transactions.forEach(tx => {
    const day = formatDate(tx.timestamp);
    if (!dayMap[day]) {
      dayMap[day] = { date: day, visits: 0, moduleViews: 0, revenue: 0 };
    }
    dayMap[day].revenue += (tx.price || 0);
  });

  // Convert to sorted array
  const dayWiseData = Object.values(dayMap)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-30);

  // 3. Module-wise metrics
  const modulesList = ["horoscope", "palm", "compatibility", "marriage", "timeline", "kundli", "career", "numerology"];
  const moduleMap = {};
  modulesList.forEach(mod => {
    moduleMap[mod] = { name: mod, visits: 0, revenue: 0 };
  });

  visits.forEach(v => {
    if (v.eventType === "module_view" && v.moduleName && moduleMap[v.moduleName]) {
      moduleMap[v.moduleName].visits += 1;
    }
  });

  transactions.forEach(tx => {
    if (tx.featureId && moduleMap[tx.featureId]) {
      moduleMap[tx.featureId].revenue += (tx.price || 0);
    }
  });

  const moduleWiseData = Object.values(moduleMap);

  // 4. Location-wise metrics
  const countryMap = {};
  const cityMap = {};

  visits.forEach(v => {
    const country = v.country;
    const city = v.city;

    countryMap[country] = (countryMap[country] || 0) + 1;
    
    const cityKey = `${city}, ${country}`;
    cityMap[cityKey] = (cityMap[cityKey] || 0) + 1;
  });

  const locationData = {
    countries: Object.entries(countryMap)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10),
    cities: Object.entries(cityMap)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 15)
  };

  // 5. Recent lists
  const recentTransactions = [...transactions]
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 50);

  const recentVisits = [...visits]
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 50);

  return {
    summary: {
      totalRevenue,
      totalVisits,
      uniqueVisitors,
      totalModuleInteractions,
    },
    dayWiseData,
    moduleWiseData,
    locationData,
    recentTransactions,
    recentVisits,
  };
}
