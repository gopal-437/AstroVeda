/**
 * Astrology calculators.
 * Deterministic calculations based on user inputs.
 */

// Array of 27 Nakshatras in Vedic astrology
const NAKSHATRAS = [
  "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra",
  "Punarvasu", "Pushya", "Ashlesha", "Magha", "Poorva Phalguni", "Uttara Phalguni",
  "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha",
  "Moola", "Poorva Ashadha", "Uttara Ashadha", "Shravana", "Dhanishta", "Shatabhisha",
  "Poorva Bhadrapada", "Uttara Bhadrapada", "Revati"
];

// Array of 12 Zodiac signs
const ZODIACS = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
];

// Helper to extract day, month, year, hour from date strings
function parseDateString(dateStr) {
  if (!dateStr) return { day: 1, month: 1, year: 2000 };
  const parts = dateStr.split("-");
  return {
    year: parseInt(parts[0], 10) || 2000,
    month: parseInt(parts[1], 10) || 1,
    day: parseInt(parts[2], 10) || 1
  };
}

function parseTimeString(timeStr) {
  if (!timeStr) return { hour: 12, minute: 0 };
  const parts = timeStr.split(":");
  return {
    hour: parseInt(parts[0], 10) || 12,
    minute: parseInt(parts[1], 10) || 0
  };
}

/**
 * Calculates Western Zodiac sign based on month and day
 */
export function getZodiacSign(dateStr) {
  const { day, month } = parseDateString(dateStr);
  
  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return "Aries";
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return "Taurus";
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return "Gemini";
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return "Cancer";
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return "Leo";
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return "Virgo";
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return "Libra";
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return "Scorpio";
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return "Sagittarius";
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return "Capricorn";
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return "Aquarius";
  return "Pisces";
}

/**
 * Deterministically simulates the lunar Nakshatra based on birth details
 */
export function getNakshatra(dateStr, timeStr) {
  const { day, month, year } = parseDateString(dateStr);
  const { hour } = parseTimeString(timeStr);
  
  // Deterministic seed formula
  const index = (day * 7 + month * 13 + year % 100 + hour) % 27;
  return NAKSHATRAS[index];
}

/**
 * Calculates Life Path Number (standard reduction to 1-9, 11, 22)
 */
export function getLifePathNumber(dateStr) {
  const { day, month, year } = parseDateString(dateStr);
  
  const sumDigits = (num) => {
    let s = 0;
    while (num > 0) {
      s += num % 10;
      num = Math.floor(num / 10);
    }
    return s;
  };

  const d = sumDigits(day);
  const m = sumDigits(month);
  const y = sumDigits(sumDigits(year));
  
  let total = d + m + y;
  
  while (total > 9) {
    if (total === 11 || total === 22) {
      return total; // Master numbers
    }
    total = sumDigits(total);
  }
  
  return total;
}

/**
 * Calculates Pythagorean Destiny Number from full name
 */
export function getDestinyNumber(name) {
  if (!name) return 5; // Default to mid number
  const nameMap = {
    a: 1, j: 1, s: 1,
    b: 2, k: 2, t: 2,
    c: 3, l: 3, u: 3,
    d: 4, m: 4, v: 4,
    e: 5, n: 5, w: 5,
    f: 6, o: 6, x: 6,
    g: 7, p: 7, y: 7,
    h: 8, q: 8, z: 8,
    i: 9, r: 9
  };

  let sum = 0;
  const cleanName = name.toLowerCase().replace(/[^a-z]/g, "");
  
  for (let i = 0; i < cleanName.length; i++) {
    sum += nameMap[cleanName[i]] || 0;
  }
  
  const reduce = (num) => {
    let s = 0;
    while (num > 0) {
      s += num % 10;
      num = Math.floor(num / 10);
    }
    return s;
  };

  while (sum > 9) {
    if (sum === 11 || sum === 22) return sum;
    sum = reduce(sum);
  }
  
  return sum === 0 ? 5 : sum;
}

/**
 * Calculates Soul Urge / Heart's Desire Number (sum of vowels in name)
 */
export function getSoulUrgeNumber(name) {
  if (!name) return 3;
  const vowelMap = {
    a: 1, e: 5, i: 9, o: 6, u: 3
  };
  let sum = 0;
  const cleanName = name.toLowerCase().replace(/[^a-z]/g, "");
  
  for (let i = 0; i < cleanName.length; i++) {
    const char = cleanName[i];
    if (vowelMap[char]) {
      sum += vowelMap[char];
    }
  }
  
  const reduce = (num) => {
    let s = 0;
    while (num > 0) {
      s += num % 10;
      num = Math.floor(num / 10);
    }
    return s;
  };

  while (sum > 9) {
    if (sum === 11 || sum === 22) return sum;
    sum = reduce(sum);
  }
  
  return sum === 0 ? 3 : sum;
}

/**
 * Calculates Birth Day Number (reduction of the day of birth)
 */
export function getBirthdayNumber(dateStr) {
  if (!dateStr) return 1;
  const parts = dateStr.split("-");
  const day = parseInt(parts[2], 10) || 1;
  
  const reduce = (num) => {
    let s = 0;
    while (num > 0) {
      s += num % 10;
      num = Math.floor(num / 10);
    }
    return s;
  };

  let total = day;
  while (total > 9) {
    if (total === 11 || total === 22) return total;
    total = reduce(total);
  }
  return total;
}

/**
 * Calculates planetary houses deterministically
 */
export function getPlanetaryPositions(dateStr, timeStr) {
  const { day, month, year } = parseDateString(dateStr);
  const { hour } = parseTimeString(timeStr);
  
  const planets = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"];
  
  return planets.map((planet, index) => {
    // Generate deterministic placement in 12 houses (1-12)
    // Rahu and Ketu are always 180 degrees apart (opposite houses, i.e., difference of 6 houses)
    let house = 1;
    if (planet === "Rahu") {
      house = ((day * 3 + month * 7 + year + hour) % 12) + 1;
    } else if (planet === "Ketu") {
      // Find Rahu's house and place Ketu in the opposite (+6 houses)
      const rahuHouse = ((day * 3 + month * 7 + year + hour) % 12) + 1;
      house = ((rahuHouse + 5) % 12) + 1;
    } else {
      house = ((day * (index + 2) + month * 11 + year + hour * (index + 1)) % 12) + 1;
    }
    
    // Degrees (0 to 30 within a house)
    const degree = Math.floor((day * (index + 3) + hour * 17) % 30);
    
    // Determine Zodiac based on house offset from Moon's or Sun's sign
    const zodiacIndex = (house + (day % 12)) % 12;
    const zodiac = ZODIACS[zodiacIndex];

    return { planet, house, degree, zodiac };
  });
}

/**
 * Deterministic relationship compatibility scores
 */
export function getCompatibilityScores(details1, details2) {
  const name1 = (details1.name || "").trim().toLowerCase();
  const name2 = (details2.name || "").trim().toLowerCase();
  
  const sumChars = (str) => {
    let sum = 0;
    for (let i = 0; i < str.length; i++) {
      sum += str.charCodeAt(i);
    }
    return sum;
  };
  
  const code1 = sumChars(name1) + (parseDateString(details1.dob).day * 13);
  const code2 = sumChars(name2) + (parseDateString(details2.dob).day * 17);
  
  // Base scores between 55 and 97
  const love = 55 + ((code1 + code2) % 43);
  const trust = 55 + ((code1 * 3 + code2) % 43);
  const communication = 55 + ((code1 + code2 * 2) % 43);
  const intimacy = 55 + ((code1 * 2 + code2 * 3) % 43);
  
  const overall = Math.round((love + trust + communication + intimacy) / 4);

  return { love, trust, communication, intimacy, overall };
}
