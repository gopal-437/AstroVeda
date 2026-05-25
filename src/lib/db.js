import fs from "fs/promises";
import path from "path";

const dbPath = path.join(process.cwd(), "data", "db.json");

// Ensure data directory exists
async function ensureDir() {
  await fs.mkdir(path.dirname(dbPath), { recursive: true });
}

// Read database
export async function readDb() {
  await ensureDir();
  try {
    const data = await fs.readFile(dbPath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    // If file doesn't exist or is invalid, return empty structure
    return { visits: [], transactions: [] };
  }
}

// Queue for serializing write operations
let writeQueue = Promise.resolve();

// Write database atomically
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
  try {
    const db = await readDb();
    
    const newVisit = {
      id: `v_${Math.random().toString(36).substring(2, 11)}`,
      eventType, // "page_view" | "module_view"
      moduleName: moduleName || null,
      country: country || "Unknown Country",
      city: city || "Unknown City",
      ip: ip || "Unknown IP",
      timestamp: Date.now(),
    };

    db.visits.push(newVisit);

    // Cap the visits array to prevent bloat (keep last 20,000 entries)
    if (db.visits.length > 20000) {
      db.visits = db.visits.slice(db.visits.length - 20000);
    }

    await writeDb(db);
    return newVisit;
  } catch (error) {
    console.error("Error tracking visit:", error);
  }
}

// Append a transaction log
export async function recordTransaction({ orderId, paymentId, featureId, price }) {
  try {
    const db = await readDb();
    
    const newTransaction = {
      orderId,
      paymentId,
      featureId,
      price: Number(price),
      timestamp: Date.now(),
    };

    db.transactions.push(newTransaction);
    await writeDb(db);
    return newTransaction;
  } catch (error) {
    console.error("Error recording transaction:", error);
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
  
  // Initialize last 7 days with 0s to make sure there's data to chart even if empty
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
    .slice(-30); // limit to last 30 days

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

  // 4. Location-wise metrics (Top countries & cities)
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
