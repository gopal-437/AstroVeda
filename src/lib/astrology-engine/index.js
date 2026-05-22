import {
  getZodiacSign,
  getNakshatra,
  getLifePathNumber,
  getDestinyNumber,
  getSoulUrgeNumber,
  getBirthdayNumber,
  getPlanetaryPositions,
  getCompatibilityScores
} from "./calculators";
import * as templatesEn from "./templates";
import * as templatesHi from "./templates_hi";

/**
 * Main Astrology Engine entry point.
 * Generates reports based on featureId, birth details, and premium state.
 */
export function generateAstrologyReport(featureId, birthDetails, isPremium = false, lang = "en") {
  const templates = lang === "hi" ? templatesHi : templatesEn;
  const {
    HOROSCOPE_TEMPLATES,
    COMPATIBILITY_TEMPLATES,
    NUMEROLOGY_TEMPLATES,
    CAREER_TEMPLATES,
    MARRIAGE_TEMPLATES,
    KUNDLI_TEMPLATES,
    PALM_TEMPLATES
  } = templates;
  // Common details parsing
  const name = birthDetails.name || "Seeker";
  const dob = birthDetails.dob || "";
  const tob = birthDetails.tob || "";
  const pob = birthDetails.pob || "";
  
  const zodiac = getZodiacSign(dob);
  const nakshatra = getNakshatra(dob, tob);

  // Helper for deterministic indexing based on user name/dob seed
  const getDeterministicItem = (array, seedStr) => {
    let sum = 0;
    for (let i = 0; i < seedStr.length; i++) {
      sum += seedStr.charCodeAt(i);
    }
    const idx = sum % array.length;
    return array[idx];
  };

  switch (featureId) {
    case "horoscope": {
      // Daily horoscope is fully free
      const seed = dob + new Date().toISOString().slice(0, 10); // locks report to today
      const prediction = getDeterministicItem(HOROSCOPE_TEMPLATES.predictions, seed);
      const loveAdvice = getDeterministicItem(HOROSCOPE_TEMPLATES.loveOneLiners, seed);
      const careerAdvice = getDeterministicItem(HOROSCOPE_TEMPLATES.careerOneLiners, seed);
      const luckyColor = getDeterministicItem(HOROSCOPE_TEMPLATES.luckyColors, seed);
      const luckyNumber = getDeterministicItem(HOROSCOPE_TEMPLATES.luckyNumbers, seed);
      
      // Calculate random but stable mood scores
      let moodHash = 0;
      for (let i = 0; i < seed.length; i++) moodHash += seed.charCodeAt(i);
      const loveScore = 60 + (moodHash % 35);
      const careerScore = 60 + ((moodHash * 3) % 35);
      const healthScore = 65 + ((moodHash * 7) % 30);
      const overallScore = Math.round((loveScore + careerScore + healthScore) / 3);

      return {
        unlocked: true,
        zodiac,
        luckyColor,
        luckyNumber,
        predictions: {
          general: prediction,
          love: loveAdvice,
          career: careerAdvice
        },
        scores: {
          overall: overallScore,
          love: loveScore,
          career: careerScore,
          health: healthScore
        }
      };
    }

    case "compatibility": {
      const partnerName = birthDetails.partnerName || "Partner";
      const partnerDob = birthDetails.partnerDob || "";
      const partnerTob = birthDetails.partnerTob || "";
      
      const partnerZodiac = getZodiacSign(partnerDob);
      const scores = getCompatibilityScores(birthDetails, { name: partnerName, dob: partnerDob });
      
      // Intro paragraph
      const introSeed = name + partnerName + dob;
      const intro = getDeterministicItem(COMPATIBILITY_TEMPLATES.intro, introSeed)
        .replace("{name1}", name)
        .replace("{name2}", partnerName);

      // Teaser details
      const teaserData = {
        unlocked: false,
        name1: name,
        name2: partnerName,
        zodiac1: zodiac,
        zodiac2: partnerZodiac,
        compatibilityPercentage: scores.overall,
        scores: {
          love: scores.love,
          trust: scores.trust,
          communication: scores.communication,
          intimacy: scores.intimacy
        },
        intro
      };

      if (!isPremium) {
        return teaserData;
      }

      // Premium reports
      const seed = name + partnerName;
      
      // Select paragraphs based on score thresholds
      const getParagraph = (highPool, midPool, lowPool, score) => {
        if (score >= 80) return getDeterministicItem(highPool, seed);
        if (score >= 60) return getDeterministicItem(midPool, seed);
        return getDeterministicItem(lowPool, seed);
      };

      const loveAnalysis = getParagraph(
        COMPATIBILITY_TEMPLATES.loveHigh,
        COMPATIBILITY_TEMPLATES.loveMid,
        COMPATIBILITY_TEMPLATES.loveLow,
        scores.love
      );
      
      const trustAnalysis = scores.trust >= 75 
        ? getDeterministicItem(COMPATIBILITY_TEMPLATES.trustHigh, seed)
        : getDeterministicItem(COMPATIBILITY_TEMPLATES.trustLow, seed);

      const commAnalysis = scores.communication >= 75
        ? getDeterministicItem(COMPATIBILITY_TEMPLATES.communicationHigh, seed)
        : getDeterministicItem(COMPATIBILITY_TEMPLATES.communicationLow, seed);

      const intimacyAnalysis = scores.intimacy >= 75
        ? getDeterministicItem(COMPATIBILITY_TEMPLATES.intimacyHigh, seed)
        : getDeterministicItem(COMPATIBILITY_TEMPLATES.intimacyLow, seed);

      return {
        ...teaserData,
        unlocked: true,
        detailedAnalysis: {
          love: loveAnalysis,
          trust: trustAnalysis,
          communication: commAnalysis,
          intimacy: intimacyAnalysis
        },
        strengths: COMPATIBILITY_TEMPLATES.strengths,
        redFlags: COMPATIBILITY_TEMPLATES.redFlags,
        relationshipTimeline: COMPATIBILITY_TEMPLATES.timeline
      };
    }

    case "numerology": {
      const lifePath = getLifePathNumber(dob);
      const destiny = getDestinyNumber(name);
      const soulUrge = getSoulUrgeNumber(name);
      const birthday = getBirthdayNumber(dob);
      
      const lpData = NUMEROLOGY_TEMPLATES.lifePath[lifePath] || NUMEROLOGY_TEMPLATES.lifePath[5];
      
      const teaserData = {
        unlocked: false,
        name,
        lifePathNumber: lifePath,
        lifePathTitle: lpData.title,
        lifePathDesc: lpData.desc,
        luckyNumber: (lifePath * 3 + name.length) % 9 + 1
      };

      if (!isPremium) {
        return teaserData;
      }

      const destData = NUMEROLOGY_TEMPLATES.lifePath[destiny] || NUMEROLOGY_TEMPLATES.lifePath[5];
      const soulUrgeData = NUMEROLOGY_TEMPLATES.lifePath[soulUrge] || NUMEROLOGY_TEMPLATES.lifePath[3];

      return {
        ...teaserData,
        unlocked: true,
        destinyNumber: destiny,
        destinyTitle: destData.title,
        destinyDesc: destData.desc,
        soulUrgeNumber: soulUrge,
        soulUrgeTitle: soulUrgeData.title,
        soulUrgeDesc: soulUrgeData.desc,
        birthdayNumber: birthday,
        careerNumerology: lpData.career,
        wealthNumerology: lpData.wealth,
        luckyDates: NUMEROLOGY_TEMPLATES.luckyDates,
        luckyBusiness: NUMEROLOGY_TEMPLATES.luckyBusiness
      };
    }

    case "career": {
      const seed = name + dob;
      let careerScore = 55 + (seed.length * 7) % 40;
      
      const teaserData = {
        unlocked: false,
        name,
        careerScore,
        generalInsight: careerScore >= 80 
          ? CAREER_TEMPLATES.scores.high 
          : careerScore >= 60 
            ? CAREER_TEMPLATES.scores.mid 
            : CAREER_TEMPLATES.scores.low
      };

      if (!isPremium) {
        return teaserData;
      }

      const jobSwitch = getDeterministicItem(CAREER_TEMPLATES.jobSwitch, seed);
      const promotion = getDeterministicItem(CAREER_TEMPLATES.promotion, seed);
      const wealthGrowth = getDeterministicItem(CAREER_TEMPLATES.wealthGrowth, seed + "wealth");

      return {
        ...teaserData,
        unlocked: true,
        switchTiming: jobSwitch,
        promotionTiming: promotion,
        wealthAnalysis: wealthGrowth,
        favorableCareerDirections: ["Technology & Architecture", "Creative Design", "Financial Management"]
      };
    }

    case "marriage": {
      const seed = name + dob;
      const possibilityScore = 50 + (seed.length * 9) % 45;
      
      const teaserData = {
        unlocked: false,
        possibilityScore,
        generalAgeRange: possibilityScore >= 75 ? "Ages 25 - 28" : "Ages 28 - 32"
      };

      if (!isPremium) {
        return teaserData;
      }

      const possibilityText = possibilityScore >= 80 
        ? MARRIAGE_TEMPLATES.possibility.high 
        : possibilityScore >= 60 
          ? MARRIAGE_TEMPLATES.possibility.mid 
          : MARRIAGE_TEMPLATES.possibility.low;

      const type = getDeterministicItem(MARRIAGE_TEMPLATES.loveVsArranged, seed);
      const partner = getDeterministicItem(MARRIAGE_TEMPLATES.partnerPersonality, seed + "partner");
      const obstacle = getDeterministicItem(MARRIAGE_TEMPLATES.obstacles, seed + "obstacles");

      return {
        ...teaserData,
        unlocked: true,
        possibilityAnalysis: possibilityText,
        marriageType: type,
        partnerAnalysis: partner,
        obstaclesAnalysis: obstacle,
        favorablePeriods: MARRIAGE_TEMPLATES.favorablePeriods
      };
    }

    case "timeline": {
      // 30 days visual graph points
      const seed = dob + name;
      const graphData = Array.from({ length: 30 }, (_, i) => {
        let val = 40 + ((seed.charCodeAt(i % seed.length) * (i + 1)) % 55);
        return { day: i + 1, score: val };
      });

      const teaserData = {
        unlocked: false,
        next30DaysGraph: graphData,
        highlightedEvent: "Around Day 14, an energetic shift occurs, creating a massive opportunity for communication and resolving past tension."
      };

      if (!isPremium) {
        return teaserData;
      }

      return {
        ...teaserData,
        unlocked: true,
        cycles: {
          careerGrowth: "Favorable transits occur between months 3-6. High focus on promotion indices.",
          relationshipPhases: "Months 8-10 present a deep harmonization aspect; perfect for commitments.",
          financialOpportunities: "Month 11 displays a wealth accumulation window, ideal for long-term investments."
        },
        futureRoadmap: [
          { period: "Months 1-3", title: "Alignment & Skills Accumulation", detail: "Internal transits recommend laying low and building knowledge structures." },
          { period: "Months 4-6", title: "Peak Career Activity", detail: "Active aspects support career adjustments, pitches, and interview success." },
          { period: "Months 7-9", title: "Emotional Strengthening", detail: "Venus aspects your 7th house, encouraging relationship growth and social connections." },
          { period: "Months 10-12", title: "Consolidation & Asset Creation", detail: "Stability aspects take hold; financial decisions made now yield long-term yields." }
        ]
      };
    }

    case "palm": {
      // Seeding helper using filename and filesize properties
      const fileSeed = (birthDetails.fileName || "default_hand") + (birthDetails.fileSize || 1024);
      
      const getSeedVal = (offset, range, seedShift = 0) => {
        const combined = fileSeed + seedShift;
        let hash = 0;
        for (let i = 0; i < combined.length; i++) {
          hash = combined.charCodeAt(i) + ((hash << 5) - hash);
        }
        return offset + (Math.abs(hash) % range);
      };

      const heartScore = getSeedVal(65, 30, 1);
      const headScore = getSeedVal(60, 35, 2);
      const lifeScore = getSeedVal(70, 26, 3);

      const hX = getSeedVal(-3, 6, 4);
      const hY = getSeedVal(-3, 6, 5);

      const teaserData = {
        unlocked: false,
        heartScore,
        headScore,
        lifeScore,
        heartTitle: heartScore >= 80 ? "Deep & Sweeping" : heartScore >= 60 ? "Balanced & Grounded" : "Independent & Guarded",
        headTitle: headScore >= 80 ? "Creative & Analytical" : headScore >= 60 ? "Logic-Driven & Practical" : "Focused & Experiential",
        lifeTitle: lifeScore >= 80 ? "Vibrant Life Force" : lifeScore >= 60 ? "Steady & Adaptable" : "Fluctuating Energy",
        // Coordinates for canvas overlay drawing
        lines: {
          heart: [
            { x: 80 + hX, y: 35 + hY },
            { x: 50 + hX, y: 40 + hY },
            { x: 25 + hX, y: 25 + hY }
          ],
          head: [
            { x: 18 + hX, y: 48 + hY },
            { x: 45 + hX, y: 52 + hY },
            { x: 75 + hX, y: 65 + hY }
          ],
          life: [
            { x: 18 + hX, y: 48 + hY },
            { x: 40 + hX, y: 60 + hY },
            { x: 45 + hX, y: 78 + hY },
            { x: 32 + hX, y: 88 + hY }
          ]
        }
      };

      if (!isPremium) {
        return teaserData;
      }

      // Premium mount scores and milestone readings
      const mountJupiter = getSeedVal(3, 3, 6); // 3 to 5 stars
      const mountSaturn = getSeedVal(3, 3, 7);
      const mountApollo = getSeedVal(3, 3, 8);
      const mountMercury = getSeedVal(3, 3, 9);
      const mountVenus = getSeedVal(3, 3, 10);
      const mountLuna = getSeedVal(3, 3, 11);

      return {
        ...teaserData,
        unlocked: true,
        heartDesc: heartScore >= 80 ? PALM_TEMPLATES.heart.high : heartScore >= 60 ? PALM_TEMPLATES.heart.mid : PALM_TEMPLATES.heart.low,
        headDesc: headScore >= 80 ? PALM_TEMPLATES.head.high : headScore >= 60 ? PALM_TEMPLATES.head.mid : PALM_TEMPLATES.head.low,
        lifeDesc: lifeScore >= 80 ? PALM_TEMPLATES.life.high : lifeScore >= 60 ? PALM_TEMPLATES.life.mid : PALM_TEMPLATES.life.low,
        mounts: [
          { name: PALM_TEMPLATES.mounts.jupiter.name, aspect: PALM_TEMPLATES.mounts.jupiter.aspect, rating: mountJupiter, desc: PALM_TEMPLATES.mounts.jupiter.desc },
          { name: PALM_TEMPLATES.mounts.saturn.name, aspect: PALM_TEMPLATES.mounts.saturn.aspect, rating: mountSaturn, desc: PALM_TEMPLATES.mounts.saturn.desc },
          { name: PALM_TEMPLATES.mounts.apollo.name, aspect: PALM_TEMPLATES.mounts.apollo.aspect, rating: mountApollo, desc: PALM_TEMPLATES.mounts.apollo.desc },
          { name: PALM_TEMPLATES.mounts.mercury.name, aspect: PALM_TEMPLATES.mounts.mercury.aspect, rating: mountMercury, desc: PALM_TEMPLATES.mounts.mercury.desc },
          { name: PALM_TEMPLATES.mounts.venus.name, aspect: PALM_TEMPLATES.mounts.venus.aspect, rating: mountVenus, desc: PALM_TEMPLATES.mounts.venus.desc },
          { name: PALM_TEMPLATES.mounts.luna.name, aspect: PALM_TEMPLATES.mounts.luna.aspect, rating: mountLuna, desc: PALM_TEMPLATES.mounts.luna.desc }
        ],
        milestones: PALM_TEMPLATES.milestones
      };
    }

    case "kundli": {
      const planets = getPlanetaryPositions(dob, tob);
      
      const teaserData = {
        unlocked: false,
        zodiac,
        nakshatra,
        planetaryPositions: planets.map(({ planet, house, degree, zodiac }) => ({
          planet, house, degree, zodiac
        })),
        basicPersonality: `Born under the star of ${nakshatra} with ${zodiac} ascendant. You possess a unique blend of intellectual curiosity and emotional depth. You seek truth and place high value on personal liberty.`
      };

      if (!isPremium) {
        return teaserData;
      }

      const seed = name + dob;
      
      // Calculate active Yogas and Doshas deterministically
      const manglik = (seed.length % 3 === 0) ? "present" : "absent";
      const kaalsarp = (seed.length % 5 === 0) ? "present" : "absent";
      const gajakesari = (seed.length % 4 === 0) ? "present" : "absent";
      const rajayoga = (seed.length % 7 === 0) ? "present" : "absent";

      return {
        ...teaserData,
        unlocked: true,
        doshaAnalysis: {
          manglik: KUNDLI_TEMPLATES.doshas.manglik[manglik],
          kaalsarp: KUNDLI_TEMPLATES.doshas.kaalsarp[kaalsarp]
        },
        yogAnalysis: {
          gajakesari: KUNDLI_TEMPLATES.yogas.gajakesari[gajakesari],
          rajayoga: KUNDLI_TEMPLATES.yogas.rajayoga[rajayoga]
        },
        remedies: KUNDLI_TEMPLATES.remedies
      };
    }

    default:
      return { error: "Unknown feature" };
  }
}
