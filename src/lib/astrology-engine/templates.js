/**
 * Dynamic Template pools for Astrology predictions.
 * Structured by feature and score brackets to create millions of unique report variants.
 */

export const HOROSCOPE_TEMPLATES = {
  predictions: [
    "The alignment of Jupiter suggests a shift in perspective. An unexpected conversation could open doors to a fresh perspective on a long-standing challenge.",
    "A celestial transit in your solar chart encourages slow, methodical progress. Refrain from hasty agreements; focus on internal alignment.",
    "Mercury's position activates your creative center today. Trust your intuition over analytical deductions when solving relational issues.",
    "A positive aspect from Venus signals harmony. This is a powerful day to express hidden emotions and clear up past misunderstandings.",
    "Mars provides a surge of action-oriented energy. Direct this power into organizing your environment and clearing mental clutter.",
    "Saturn's presence prompts a review of boundaries. A gentle 'no' today is a deposit into your future peace of mind.",
    "Moon's entry into your house of expression heightens emotional clarity. You can articulate deep concepts with ease today.",
    "An auspicious solar configuration illuminates your path. A minor risk taken in faith is favored to yield positive outcomes."
  ],
  loveOneLiners: [
    "A quiet moment shared with someone special will speak louder than grand gestures today.",
    "Let go of expectations; allow connections to evolve naturally without forcing labels.",
    "Vulnerability is your magnetic force today. An honest admission strengthens bonds.",
    "Venus suggests prioritizing listening over speaking to dissolve a growing wall.",
    "A surprise interaction today carries the seed of a future emotional milestone."
  ],
  careerOneLiners: [
    "Focus on finishing started tasks; a distracted mind is your only obstacle today.",
    "An opportunity to display your unique skill set is arriving. Step forward.",
    "Financial transits advise cautious budgeting. A small delay in spending pays off later.",
    "Your collaborative efforts are highlighted. Support a colleague's initiative.",
    "A major long-term professional goal requires a slight shift in daily habits."
  ],
  luckyColors: ["Celestial Blue", "Solar Gold", "Emerald Green", "Cosmic Crimson", "Deep Indigo", "Warm Amber", "Orchid Purple", "Starlight Silver"],
  luckyNumbers: [1, 3, 5, 7, 8, 9, 11, 22]
};

export const COMPATIBILITY_TEMPLATES = {
  intro: [
    "Your charts reveal a deep energetic resonance. The cosmic alignment between {name1} and {name2} points to a path of shared spiritual lessons.",
    "The synastry of your stars indicates a relationship built on balancing polarities. Where one leads, the other provides grounding."
  ],
  loveHigh: [
    "The Venusian harmony between your charts is exceptionally strong. You share a natural emotional vocabulary, allowing you to sense each other's moods without verbal cues.",
    "Love flows with ease here. Your cosmic configurations show an innate capacity for empathy and mutual adoration, creating a safe sanctuary in each other's presence."
  ],
  loveMid: [
    "Your emotional compatibility is stable, though it requires intentional alignment. You show deep affection, but differing emotional rhythms require conscious adjustment.",
    "The chemistry is active, yet delicate. There is a healthy attraction, but periodic adjustments of personal space are needed to keep the fire burning safely."
  ],
  loveLow: [
    "Your emotional signs operate on very different wavelengths. Love in this connection is a conscious growth experience, testing your ability to accept differences.",
    "A challenging aspect between your lunar signs suggests emotional friction. Expect periods of distance where you must work hard to bridge the emotional divide."
  ],
  trustHigh: [
    "Saturn and Jupiter align to create an unbreakable bond of trust. You naturally feel safe exposing your deepest vulnerabilities, knowing they will be handled with care.",
    "A foundation of deep integrity exists between you. Betrayal is highly unlikely as your charts reflect transparent communication and aligned values."
  ],
  trustLow: [
    "Prone to unvoiced anxieties. Challenging planetary aspects suggest that past emotional baggage could trigger unnecessary suspicion in this relationship.",
    "Trust is a mountain to climb here. Hidden fears of abandonment or control require absolute transparency from the very beginning."
  ],
  communicationHigh: [
    "Mercury aligns beautifully in both charts. Conversations feel effortless, like an ongoing dialogue between two old souls. You easily resolve conflicts through discussion.",
    "Your mental synchronization is remarkable. You share jokes, finish each other's thoughts, and naturally align on philosophical and practical issues."
  ],
  communicationLow: [
    "Misunderstandings can build quickly. Differing cognitive styles mean one talks logically while the other communicates emotionally. Active listening is essential.",
    "Silence is sometimes weaponized or misunderstood in this dynamic. Developing structured ways to discuss conflict is vital to avoid emotional detachment."
  ],
  intimacyHigh: [
    "Your physical and emotional intimacy chart indicators glow with intense warmth. A profound magnetic attraction bridges the gap between your physical and spiritual selves.",
    "An electric connection that doesn't fade with time. The intimacy indicators are fueled by deep passion and mutual physical comfort."
  ],
  intimacyLow: [
    "Intimacy requires slow cultivation. The physical chemistry may feel blocked at times by unaddressed emotional distance or differing schedules.",
    "Flickering physical chemistry. You must work to create dedicated, distraction-free spaces to nourish the romantic spark."
  ],
  strengths: [
    "Strong mutual respect and capability to support each other's individual professional ambitions.",
    "Shared sense of humor and ability to find joy in simple daily routines.",
    "Exceptional resilience during life crises; you act as a united team under pressure."
  ],
  redFlags: [
    "Tendency to sweep minor annoyances under the rug until they erupt into major arguments.",
    "Differing financial values which could lead to friction if assets are fully merged without clear rules.",
    "A risk of emotional codependency, where personal identity is temporarily lost in the partnership."
  ],
  timeline: [
    "Phase 1 (Months 1-6): High energetic discovery and rapid boundary setting.",
    "Phase 2 (Months 6-18): Deepening values integration. An important shared decision occurs around month 12.",
    "Phase 3 (2 Years+): Transition to a stable, long-term foundation with joint asset creation."
  ]
};

export const NUMEROLOGY_TEMPLATES = {
  lifePath: {
    1: {
      title: "The Leader / Innovator",
      desc: "Driven by independence, creativity, and a pioneering spirit. You are meant to stand out and forge new paths rather than follow the crowd.",
      career: "Perfect for entrepreneurship, management, creative direction, and independent consulting.",
      wealth: "High wealth potential driven by personal initiative, though you must guard against impulsive investments."
    },
    2: {
      title: "The Peacemaker / Diplomat",
      desc: "Defined by cooperation, intuition, and a supportive nature. You find your power in harmony, collaboration, and bridging divides.",
      career: "Thrives in mediation, counseling, research, human resources, and supportive executive roles.",
      wealth: "Steady growth. Wealth is accumulated through partnerships, joint ventures, and methodical savings."
    },
    3: {
      title: "The Creative / Communicator",
      desc: "Exudes self-expression, joy, and artistic talent. You inspire others through word, art, or performance.",
      career: "Suited for writing, marketing, public relations, design, entertainment, and teaching.",
      wealth: "Fluctuating financial cycles. Money flows easily when you follow your passion, but vanishes under emotional spending."
    },
    4: {
      title: "The Builder / Organizer",
      desc: "Built on stability, discipline, and practical execution. You are the pillar of strength who constructs systems that endure.",
      career: "Thrives in engineering, project management, law, accounting, and operational development.",
      wealth: "Slow, secure accumulation. Wealth comes from hard work, real estate, and long-term conservative assets."
    },
    5: {
      title: "The Explorer / Changemaker",
      desc: "Fueled by freedom, adaptability, and adventure. You learn through diverse experiences and thrive in dynamic settings.",
      career: "Excels in travel, sales, media, consulting, and any role with high travel and flexible hours.",
      wealth: "Unpredictable. Sudden windfalls are common, but require active financial discipline to preserve."
    },
    6: {
      title: "The Nurturer / Caregiver",
      desc: "Centered on responsibility, love, and community. You find fulfillment in healing, beautifying environments, and helping others.",
      career: "Suited for medicine, therapy, hospitality, design, education, and social services.",
      wealth: "Secure. Often blessed with family support, inheritance, or stable real estate wealth."
    },
    7: {
      title: "The Seeker / Analyst",
      desc: "Driven by wisdom, truth, and spiritual depth. You look beneath the surface and possess a powerful, analytical mind.",
      career: "Thrives in science, research, coding, philosophy, astrology, and deep analysis.",
      wealth: "Material wealth is secondary, but flows naturally as a side-product of your specialized expertise."
    },
    8: {
      title: "The Powerhouse / Executive",
      desc: "A symbol of material authority, financial mastery, and cosmic balance. You are born to manage large resources.",
      career: "Perfect for finance, law, real estate development, manufacturing, and corporate leadership.",
      wealth: "Highest capacity for massive wealth creation, coupled with significant tests of financial recovery."
    },
    9: {
      title: "The Humanitarian / Philanthropist",
      desc: "Guided by universal compassion, artistic expression, and global vision. You seek to leave the world better than you found it.",
      career: "Excels in non-profits, creative arts, international law, environmentalism, and healing.",
      wealth: "Wealth follows altruism. The more you give and create value for humanity, the more resources flow back to you."
    },
    11: {
      title: "The Intuitive Guide (Master Number)",
      desc: "Charged with spiritual insights, sensitivity, and charismatic influence. You act as a bridge between worlds.",
      career: "Psychotherapy, spiritual guidance, innovation leadership, art, and visionary writing.",
      wealth: "Highly linked to emotional state. Spiritual alignment creates massive wealth; alignment with fear blocks flow."
    },
    22: {
      title: "The Master Architect (Master Number)",
      desc: "Possesses the unique power to turn large spiritual visions into physical, structured reality. High practical reach.",
      career: "Large scale development, international organizations, technology building, and systems design.",
      wealth: "Potential for massive, systematic wealth that benefits communities and large groups of people."
    }
  },
  luckyDates: ["1st, 10th, 19th, 28th of any month"],
  luckyBusiness: "Companies focused on innovation, digital products, consulting, or aesthetics."
};

export const CAREER_TEMPLATES = {
  scores: {
    high: "Your career chart is highly activated. Planetary transits show strong leadership capabilities and professional authority.",
    mid: "Your professional sector is steady. You succeed through consistency, specialized skills, and cooperative teamwork.",
    low: "Your career house indicates a phase of reflection. Focus on learning new skills and avoid making hasty job changes now."
  },
  jobSwitch: [
    "Favorable winds for a transition are visible in the upcoming 3 to 5 months. Align your resume and expand your professional network.",
    "A job change right now is not advised. Stabilize your current role and build relationships; the ideal door opens in about 8 months."
  ],
  promotion: [
    "A strong period of visibility is approaching. Speak up in meetings and take ownership; recognition is favored within the next quarter.",
    "Recognition will arrive, but it will be gradual. Focus on building technical expertise rather than chasing immediate status upgrades."
  ],
  wealthGrowth: [
    "Wealth is highly linked to digital assets or intellectual property. Diversify away from standard savings into asset classes.",
    "Your primary wealth creator is your direct day-job income. Focus on upskilling to jump brackets; avoid high-risk trading schemes."
  ]
};

export const MARRIAGE_TEMPLATES = {
  possibility: {
    high: "Your marital sector is highly aspected by benevolent Jupiter. Marriage is highly likely to bring stability and material comfort.",
    mid: "Stable marital transits. Marriage will happen at a balanced phase in life, built on mutual respect and shared responsibilities.",
    low: "The marriage house displays lessons in patience. Saturn aspects suggest delay, which is beneficial as it ensures emotional maturity."
  },
  loveVsArranged: [
    "Your chart shows a strong personal choice indicator. You will likely meet your partner through social circles, work, or travel.",
    "A strong family-influenced or introduced connection is visible. A structured introduction leads to deep long-term attachment."
  ],
  partnerPersonality: [
    "Your partner will be highly analytical, communicative, and detail-oriented. They will keep you grounded and organized.",
    "Your partner will possess a warm, expressive, and artistic nature. They will bring warmth, social circles, and fun into your life."
  ],
  obstacles: [
    "Minor friction related to in-laws or domestic adjustments. Ensure clear separate living boundaries early on.",
    "Differing work-life balance habits. Agree on dedicated family time to prevent professional schedules from causing distance."
  ],
  favorablePeriods: [
    "Age 26 - 28 is highly active",
    "Age 30 - 32 is exceptionally strong"
  ]
};

export const KUNDLI_TEMPLATES = {
  doshas: {
    manglik: {
      present: "Mild Manglik Dosha detected. This can cause occasional emotional outbursts. Remedied by performing acts of service and practicing patience.",
      absent: "No Manglik Dosha. Your relationship house is clear of malefic martial obstructions."
    },
    kaalsarp: {
      present: "Anila Kaal Sarp Dosha is present. This indicates minor delays in professional success during early youth, followed by rapid rises after age 30.",
      absent: "No Kaal Sarp Dosha. Planetary energies flow freely across all houses in your chart."
    }
  },
  yogas: {
    gajakesari: {
      present: "Gaja Kesari Yoga detected. Jupiter and Moon aspect each other, promising intellectual fame, wealth, and natural counseling abilities.",
      absent: "Gaja Kesari Yoga is absent, though individual planetary strengths compensate."
    },
    rajayoga: {
      present: "Dharma Karmadhipati Raja Yoga present. Your houses of actions and luck are connected, bringing rapid recovery from professional setbacks.",
      absent: "Raja Yoga indicators are quiet, suggesting success is earned through direct action and persistence."
    }
  },
  remedies: [
    "Gemstone: Wear a natural yellow sapphire or pearl (based on ascendant) to strengthen Jupiter and the Moon.",
    "Charity: Donate green items or grains on Wednesdays to calm Mercury transits.",
    "Daily: Spend 5 minutes facing East in quiet meditation during sunrise to align solar energy."
  ]
};

export const PALM_TEMPLATES = {
  heart: {
    high: "Your Heart Line is long, clear, and sweeps gracefully towards the Mount of Jupiter. This indicates deep emotional intelligence, empathy, and a highly nurturing approach to relationships. You connect deeply and value emotional security.",
    mid: "Your Heart Line is straight and well-defined, ending between the Jupiter and Saturn mounts. This shows a balanced approach to love—combining emotional warmth with practical expectations and healthy boundaries.",
    low: "Your Heart Line displays minor islands or branches. This suggests a highly independent emotional nature. You guard your heart carefully and take time to build trust before opening up fully."
  },
  head: {
    high: "Your Head Line is long and curves slightly towards the Mount of Luna. This indicates high creative intelligence, lateral thinking, and strong analytical capabilities. You digest complex ideas quickly.",
    mid: "Your Head Line runs straight across the palm, indicating a highly practical, logic-driven, and structured mind. You excel at organization, troubleshooting, and direct communication.",
    low: "Your Head Line is short but deep, reflecting a focused, singular cognitive style. You prefer hands-on experience and action over abstract theories or endless planning."
  },
  life: {
    high: "Your Life Line forms a wide, sweeping arc around the Mount of Venus, deep and without breaks. This promises robust physical vitality, strong resilience to illness, and a vibrant life force.",
    mid: "Your Life Line is clear and moderately curved. This indicates steady energy levels, adaptability to change, and a balanced lifestyle that respects physical boundaries.",
    low: "Your Life Line displays minor chains or fadeouts. This suggests that your energy levels fluctuate. Rest, healthy routines, and energy conservation are key to maintaining your stamina."
  },
  mounts: {
    jupiter: { name: "Mount of Jupiter", aspect: "Ambition & Leadership", desc: "Associated with leadership, social standing, and self-confidence." },
    saturn: { name: "Mount of Saturn", aspect: "Wisdom & Discipline", desc: "Associated with focus, work ethic, structure, and integrity." },
    apollo: { name: "Mount of Apollo (Sun)", aspect: "Creativity & Success", desc: "Associated with artistic talents, popularity, and emotional expression." },
    mercury: { name: "Mount of Mercury", aspect: "Communication & Trade", desc: "Associated with business intelligence, quick thinking, and adaptability." },
    venus: { name: "Mount of Venus", aspect: "Love & Vitality", desc: "Associated with passion, warmth, physical energy, and relationships." },
    luna: { name: "Mount of Luna (Moon)", aspect: "Intuition & Imagination", desc: "Associated with creativity, travel, inner sub-conscious, and dreams." }
  },
  milestones: [
    { age: 24, title: "Career Shift & Focus", desc: "A strong branch rising off the Life Line indicates a major breakthrough in self-reliance and vocational alignment." },
    { age: 32, title: "Emotional Stabilization", desc: "A minor horizontal line crossing shows a period of anchoring, family focus, or settling down in a permanent residence." },
    { age: 45, title: "Wealth Horizon", desc: "An upward line heading towards the Saturn mount indicates a significant rise in assets, leadership authority, or business ownership." },
    { age: 60, title: "Wisdom Zenith", desc: "The Life Line runs deep and clear, promising a peaceful, respected era of mentorship, travel, and physical wellness." }
  ]
};

