"use client";

import React, { useState, useEffect } from "react";
import styles from "./Kundli.module.css";
import CheckoutModal from "./CheckoutModal";
import { getBirthHash } from "@/lib/astrology-engine/helpers";
import { useTranslation } from "@/lib/LanguageContext";

const planetAbbr = {
  Sun: "Su",
  Moon: "Mo",
  Mars: "Ma",
  Mercury: "Me",
  Jupiter: "Ju",
  Venus: "Ve",
  Saturn: "Sa",
  Rahu: "Ra",
  Ketu: "Ke"
};

// Coordinates mapping for North Indian style Kundli houses
const houseCoords = {
  1: { numX: 150, numY: 130, posX: 150, posY: 90, label: "1st House (Ascendant)" },
  2: { numX: 30, numY: 110, posX: 50, posY: 75, label: "2nd House (Wealth)" },
  3: { numX: 30, numY: 190, posX: 50, posY: 225, label: "3rd House (Siblings)" },
  4: { numX: 130, numY: 150, posX: 90, posY: 150, label: "4th House (Mother/Home)" },
  5: { numX: 110, numY: 275, posX: 80, posY: 245, label: "5th House (Children/Intellect)" },
  6: { numX: 190, numY: 275, posX: 220, posY: 245, label: "6th House (Enemies/Debt)" },
  7: { numX: 150, numY: 170, posX: 150, posY: 210, label: "7th House (Marriage)" },
  8: { numX: 270, numY: 190, posX: 250, posY: 225, label: "8th House (Longevity)" },
  9: { numX: 270, numY: 110, posX: 250, posY: 75, label: "9th House (Luck/Father)" },
  10: { numX: 170, numY: 150, posX: 210, posY: 150, label: "10th House (Profession)" },
  11: { numX: 190, numY: 25, posX: 220, posY: 55, label: "11th House (Income/Gains)" },
  12: { numX: 110, numY: 25, posX: 80, posY: 55, label: "12th House (Loss/Moksha)" }
};

const zodiacMapHi = {
  Aries: "मेष", Taurus: "वृषभ", Gemini: "मिथुन", Cancer: "कर्क", Leo: "सिंह", Virgo: "कन्या",
  Libra: "तुला", Scorpio: "वृश्चिक", Sagittarius: "धनु", Capricorn: "मकर", Aquarius: "कुंभ", Pisces: "मीन"
};

const planetMapHi = {
  Sun: "सूर्य", Moon: "चन्द्र", Mars: "मंगल", Mercury: "बुध", Jupiter: "बृहस्पति", Venus: "शुक्र", Saturn: "शनि", Rahu: "राहु", Ketu: "केतु"
};

export default function Kundli() {
  const [formData, setFormData] = useState({
    name: "",
    dob: "",
    tob: "",
    pob: ""
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState(null);
  const [token, setToken] = useState("");
  const [showCheckout, setShowCheckout] = useState(false);
  const [activeHouse, setActiveHouse] = useState(null);
  const [selectedGemstone, setSelectedGemstone] = useState(null);
  const { t, language } = useTranslation();

  // Load token from localStorage if exists
  useEffect(() => {
    if (submitted && formData.name && formData.dob) {
      const hash = getBirthHash(formData);
      const savedToken = localStorage.getItem(`token_kundli_${hash}`);
      if (savedToken) {
        setToken(savedToken);
      }
    }
  }, [submitted, formData]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFetchReport = async (currentToken = "") => {
    setLoading(true);
    try {
      const res = await fetch("/api/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          featureId: "kundli",
          birthDetails: formData,
          token: currentToken || token,
          lang: language
        })
      });
      const data = await res.json();
      setReport(data);
    } catch (err) {
      console.error("Error fetching Kundli chart:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.dob || !formData.tob || !formData.pob) {
      alert(language === "hi" ? "कृपया सभी आवश्यक फ़ील्ड भरें।" : "Please enter all required details.");
      return;
    }
    setSubmitted(true);
    const hash = getBirthHash(formData);
    const savedToken = localStorage.getItem(`token_kundli_${hash}`) || "";
    handleFetchReport(savedToken);
  };

  const handlePaymentSuccess = (receivedToken) => {
    setToken(receivedToken);
    const hash = getBirthHash(formData);
    localStorage.setItem(`token_kundli_${hash}`, receivedToken);
    setShowCheckout(false);
    handleFetchReport(receivedToken);
  };

  const handlePrint = () => {
    document.body.classList.add("printing-kundli");
    window.print();
  };

  useEffect(() => {
    const handleBeforePrint = () => {
      if (submitted && report && report.unlocked) {
        document.body.classList.add("printing-kundli");
      }
    };
    const handleAfterPrint = () => {
      document.body.classList.remove("printing-kundli");
    };
    window.addEventListener("beforeprint", handleBeforePrint);
    window.addEventListener("afterprint", handleAfterPrint);
    return () => {
      window.removeEventListener("beforeprint", handleBeforePrint);
      window.removeEventListener("afterprint", handleAfterPrint);
    };
  }, [submitted, report]);

  const resetForm = () => {
    setSubmitted(false);
    setReport(null);
    setToken("");
    setActiveHouse(null);
    setSelectedGemstone(null);
  };

  const planetsByHouse = {};
  for (let h = 1; h <= 12; h++) {
    planetsByHouse[h] = [];
  }

  if (report && report.planetaryPositions) {
    report.planetaryPositions.forEach((p) => {
      planetsByHouse[p.house].push(p);
    });
  }

  const getHouseLabel = (num, lang) => {
    const hiLabels = {
      1: "प्रथम भाव (लग्न)",
      2: "द्वितीय भाव (धन)",
      3: "तृतीय भाव (भाई-बहन/पराक्रम)",
      4: "चतुर्थ भाव (माता/सुख)",
      5: "पंचम भाव (संतान/बुद्धि)",
      6: "षष्ठ भाव (शत्रु/ऋण/रोग)",
      7: "सप्तम भाव (विवाह/साझेदारी)",
      8: "अष्टम भाव (आयु/मृत्यु)",
      9: "नवम भाव (भाग्य/पिता)",
      10: "दशम भाव (कर्म/व्यवसाय)",
      11: "एकादश भाव (आय/लाभ)",
      12: "द्वादश भाव (व्यय/मोक्ष)"
    };
    return lang === "hi" ? hiLabels[num] : houseCoords[num].label;
  };

  const getPlanetName = (p, lang) => lang === "hi" ? (planetMapHi[p] || p) : p;
  const getZodiacName = (z, lang) => lang === "hi" ? (zodiacMapHi[z] || z) : z;

  return (
    <div className={styles.container}>
      {!submitted ? (
        <form onSubmit={handleSubmit} className={styles.formContainer}>
          <div className={styles.formGrid}>
            <div className={styles.inputGroup}>
              <label>{t("form_full_name")}</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder={t("form_placeholder_name")}
                required
              />
            </div>
            <div className={styles.inputGroup}>
              <label>{t("form_dob")}</label>
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                required
              />
            </div>
            <div className={styles.inputGroup}>
              <label>{t("form_tob")}</label>
              <input
                type="time"
                name="tob"
                value={formData.tob}
                onChange={handleChange}
                required
              />
            </div>
            <div className={styles.inputGroup}>
              <label>{t("form_pob")}</label>
              <input
                type="text"
                name="pob"
                value={formData.pob}
                onChange={handleChange}
                placeholder={t("form_placeholder_pob")}
                required
              />
            </div>
          </div>
          <div className={styles.submitRow}>
            <button type="submit" className="btn-gold pulse-button">
              {t("btn_generate_kundli")}
            </button>
          </div>
        </form>
      ) : (
        <div className={styles.resultsArea}>
          {loading || !report ? (
            <div className={styles.loaderArea}>
              <div className="spinner"></div>
              <p>{t("loader_kundli")}</p>
            </div>
          ) : (
            <div className={styles.reportContent}>
              <div className={`${styles.backRow} no-print`}>
                <button onClick={resetForm} className={styles.backBtn}>
                  {t("form_reset")}
                </button>
              </div>

              <div className={styles.reportHeader}>
                <h2>{language === "hi" ? "वैदिक कुण्डली और ज्योतिषीय चार्ट" : "Vedic Kundli & Astro Chart"}</h2>
                <p className={styles.subtitle}>{t("career_report_calculated_for").replace("{name}", formData.name)}</p>
              </div>

              <div className={styles.chartDashboard}>
                <div className={styles.svgWrapper}>
                  <svg viewBox="0 0 300 300" className={styles.kundliSvg}>
                    <rect x="10" y="10" width="280" height="280" fill="none" stroke="#d4a359" strokeWidth="2.5" />
                    <line x1="10" y1="10" x2="290" y2="290" stroke="#d4a359" strokeWidth="1.5" />
                    <line x1="290" y1="10" x2="10" y2="290" stroke="#d4a359" strokeWidth="1.5" />
                    <polygon points="150,10 290,150 150,290 10,150" fill="none" stroke="#d4a359" strokeWidth="1.5" />
                    {Object.keys(houseCoords).map((houseNum) => {
                      const coords = houseCoords[houseNum];
                      const planets = planetsByHouse[houseNum] || [];
                      const isHovered = activeHouse === parseInt(houseNum);
                      return (
                        <g key={houseNum} onMouseEnter={() => setActiveHouse(parseInt(houseNum))} onMouseLeave={() => setActiveHouse(null)} className={styles.houseGroup}>
                          <text x={coords.numX} y={coords.numY} className={styles.houseLabel} textAnchor="middle">{houseNum}</text>
                          <text x={coords.posX} y={coords.posY} className={`${styles.planetLabel} ${isHovered ? styles.planetLabelActive : ""}`} textAnchor="middle">
                            {planets.length > 0 ? planets.map((p) => planetAbbr[p.planet]).join(" ") : "—"}
                          </text>
                        </g>
                      );
                    })}
                  </svg>
                  <div className={styles.houseIndicator}>
                    {activeHouse ? (
                      <>
                        <span className={styles.indTitle}>{getHouseLabel(activeHouse, language)}</span>
                        <span className={styles.indPlanets}>
                          {language === "hi" ? "ग्रह: " : "Planets: "}
                          {planetsByHouse[activeHouse]?.length > 0
                            ? planetsByHouse[activeHouse].map((p) => `${getPlanetName(p.planet, language)} (${p.degree}° ${getZodiacName(p.zodiac, language)})`).join(", ")
                            : (language === "hi" ? "कोई ग्रह उपस्थित नहीं" : "No planets residing")}
                        </span>
                      </>
                    ) : (
                      <span className={styles.indHint}>{language === "hi" ? "ग्रहों को देखने के लिए किसी भाव पर माउस ले जाएं" : "Hover over a house to view residing planets"}</span>
                    )}
                  </div>
                </div>

                <div className={styles.teaserSide}>
                  <div className={styles.teaserItem}>
                    <span className={styles.metaLabel}>{language === "hi" ? "लग्न राशि (Lagna)" : "Ascendant Sign (Lagna)"}</span>
                    <span className={styles.metaValue}>{getZodiacName(report.zodiac, language)}</span>
                  </div>
                  <div className={styles.teaserItem}>
                    <span className={styles.metaLabel}>{language === "hi" ? "जन्म नक्षत्र (Nakshatra)" : "Birth Star (Nakshatra)"}</span>
                    <span className={styles.metaValue}>{report.nakshatra}</span>
                  </div>
                  <div className={styles.teaserDesc}>
                    <h4>{language === "hi" ? "व्यक्तित्व विवरण" : "Personality Profile"}</h4>
                    <p>{report.basicPersonality}</p>
                  </div>
                </div>
              </div>

              {!report.unlocked ? (
                <div className={`${styles.lockCard} no-print`}>
                  <span className={styles.lockIcon}>🔒</span>
                  <h3>{t("lock_title_kundli")}</h3>
                  <p>{t("lock_desc_kundli")}</p>
                  <div className={styles.pricingRow}>
                    <span className={styles.crossPrice}>₹499</span>
                    <span className={styles.activePrice}>₹49</span>
                  </div>
                  <button onClick={() => setShowCheckout(true)} className="btn-gold pulse-button">
                    {t("lock_btn_kundli")}
                  </button>
                </div>
              ) : (
                <div className={styles.premiumReport}>
                  <hr className={styles.divider} />
                  <div className={styles.visualBadgesGrid}>
                    {report.doshaAnalysis?.manglik && (
                      <div className={`${styles.badgeCard} ${report.doshaAnalysis.manglik.includes("Protected") || report.doshaAnalysis.manglik.includes("absent") ? styles.shieldGreen : styles.shieldRed}`}>
                        <div className={styles.badgeVisual}>
                          <svg viewBox="0 0 64 64" className={styles.badgeSvg}>
                            <path d="M32 4 L54 12 L54 36 C54 48 44 56 32 60 C20 56 10 48 10 36 L10 12 Z" fill="none" stroke="currentColor" strokeWidth="3.5" />
                            <path d="M20 28 L28 36 L44 20" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>
                        <div className={styles.badgeInfo}>
                          <h5>{language === "hi" ? "मांगलिक दोष" : "Manglik Dosha"}</h5>
                          <p>{report.doshaAnalysis.manglik}</p>
                        </div>
                      </div>
                    )}
                    {report.doshaAnalysis?.kaalsarp && (
                      <div className={`${styles.badgeCard} ${report.doshaAnalysis.kaalsarp.includes("absent") || report.doshaAnalysis.kaalsarp.includes("Clear") ? styles.shieldGreen : styles.shieldPurple}`}>
                        <div className={styles.badgeVisual}>
                          <svg viewBox="0 0 64 64" className={styles.badgeSvg}>
                            <path d="M32 8 C20 8 12 18 12 28 C12 40 22 44 22 50 C22 56 16 58 32 58 C48 58 42 56 42 50 C42 44 52 40 52 28 C52 18 44 8 32 8 Z" fill="none" stroke="currentColor" strokeWidth="3.5" />
                            <circle cx="26" cy="24" r="2" fill="currentColor" />
                            <circle cx="38" cy="24" r="2" fill="currentColor" />
                            <path d="M28 34 Q32 38 36 34" fill="none" stroke="currentColor" strokeWidth="2.5" />
                          </svg>
                        </div>
                        <div className={styles.badgeInfo}>
                          <h5>{language === "hi" ? "काल सर्प दोष" : "Kaal Sarp Dosha"}</h5>
                          <p>{report.doshaAnalysis.kaalsarp}</p>
                        </div>
                      </div>
                    )}
                    {report.yogAnalysis?.gajakesari && (
                      <div className={`${styles.badgeCard} ${report.yogAnalysis.gajakesari.includes("absent") ? styles.shieldMuted : styles.shieldGold}`}>
                        <div className={styles.badgeVisual}>
                          <svg viewBox="0 0 64 64" className={styles.badgeSvg}>
                            <circle cx="32" cy="32" r="24" fill="none" stroke="currentColor" strokeWidth="3" />
                            <path d="M18 42 L22 24 L32 34 L42 24 L46 42 Z" fill="none" stroke="currentColor" strokeWidth="3" />
                            <circle cx="18" cy="20" r="1.5" fill="currentColor" />
                            <circle cx="32" cy="20" r="1.5" fill="currentColor" />
                            <circle cx="46" cy="20" r="1.5" fill="currentColor" />
                          </svg>
                        </div>
                        <div className={styles.badgeInfo}>
                          <h5>{language === "hi" ? "गजकेसरी योग" : "Gajakesari Yoga"}</h5>
                          <p>{report.yogAnalysis.gajakesari}</p>
                        </div>
                      </div>
                    )}
                    {report.yogAnalysis?.rajayoga && (
                      <div className={`${styles.badgeCard} ${report.yogAnalysis.rajayoga.includes("absent") ? styles.shieldMuted : styles.shieldGold}`}>
                        <div className={styles.badgeVisual}>
                          <svg viewBox="0 0 64 64" className={styles.badgeSvg}>
                            <polygon points="12,46 22,20 32,38 42,20 52,46" fill="none" stroke="currentColor" strokeWidth="3" />
                            <rect x="12" y="48" width="40" height="4" rx="2" fill="currentColor" />
                          </svg>
                        </div>
                        <div className={styles.badgeInfo}>
                          <h5>{language === "hi" ? "राज योग" : "Raja Yoga"}</h5>
                          <p>{report.yogAnalysis.rajayoga}</p>
                        </div>
                      </div>
                    )}
                  </div>
                  {report.remedies?.gemstone && (
                    <div className={styles.gemstoneSection}>
                      <h4 className={styles.remedyHeader}>{language === "hi" ? "शुभ वैदिक रत्न" : "Auspicious Vedic Gemstones"}</h4>
                      <p className={styles.sectionSubtitle}>{language === "hi" ? "कमजोर शुभ भाव स्वामियों को मजबूत करने के लिए अनुशंसित ग्रहीय रत्न।" : "Planetary crystals recommended to strengthen weak benefic house lords."}</p>
                      <div className={styles.gemsGrid}>
                        {["Yellow Sapphire", "Pearl", "Ruby"].map((gemName, gemIdx) => {
                          const getColors = () => {
                            const map = {
                              "Yellow Sapphire": { fill: "#fbbf24", stroke: "#d97706", label: language === "hi" ? "बृहस्पति संरेखण" : "Jupiter Alignment", localName: language === "hi" ? "पुखराज (Yellow Sapphire)" : "Yellow Sapphire" },
                              Pearl: { fill: "#f1f5f9", stroke: "#cbd5e1", label: language === "hi" ? "चंद्र सामंजस्य" : "Lunar Harmony", localName: language === "hi" ? "मोती (Pearl)" : "Pearl" },
                              Ruby: { fill: "#ef4444", stroke: "#b91c1c", label: language === "hi" ? "सौर ऊर्जा" : "Solar Vitality", localName: language === "hi" ? "माणिक्य (Ruby)" : "Ruby" }
                            };
                            return map[gemName] || { fill: "#e879f9", stroke: "#c084fc", label: "Cosmic Aspect", localName: gemName };
                          };
                          const conf = getColors();
                          const isActive = selectedGemstone === gemName;
                          return (
                            <div key={gemIdx} className={`${styles.gemCard} ${isActive ? styles.gemCardActive : ""}`} onClick={() => setSelectedGemstone(isActive ? null : gemName)}>
                              <div className={styles.gemVisual}>
                                <svg viewBox="0 0 64 64" className={styles.gemSvg}>
                                  <polygon points="32,8 52,24 44,54 20,54 12,24" fill={conf.fill} fillOpacity={isActive ? 0.9 : 0.6} stroke={conf.stroke} strokeWidth="3.5" />
                                  <line x1="32" y1="8" x2="32" y2="54" stroke={conf.stroke} strokeWidth="1.5" />
                                  <line x1="12" y1="24" x2="32" y2="24" stroke={conf.stroke} strokeWidth="1.5" />
                                  <line x1="52" y1="24" x2="32" y2="24" stroke={conf.stroke} strokeWidth="1.5" />
                                </svg>
                                <span className={styles.gemBadge}>{conf.label}</span>
                              </div>
                              <div className={styles.gemText}>
                                <h5>{conf.localName}</h5>
                                <p>{language === "hi" ? "ग्रहीय सक्रियण मंत्र और अनुष्ठान देखने के लिए क्लिक करें।" : "Click to view planetary activation mantra and rituals."}</p>
                              </div>
                              {isActive && (
                                <div className={styles.gemDetailsPanel}>
                                  <div className={styles.detailRow}>
                                    <strong>{language === "hi" ? "मंत्र: " : "Mantra:"}</strong>
                                    <span>
                                      {gemName === "Yellow Sapphire"
                                        ? (language === "hi" ? "ॐ गुरुवे नमः (गुरुवार सुबह 108 बार)" : "Om Guruve Namaha (108 times on Thursday morning)")
                                        : gemName === "Pearl"
                                        ? (language === "hi" ? "ॐ सोमाय नमः (सोमवार शाम 108 बार)" : "Om Som Somaya Namaha (108 times on Monday evening)")
                                        : (language === "hi" ? "ॐ घृणि सूर्याय नमः (रविवार सुबह 108 बार)" : "Om Ghrini Suryaya Namaha (108 times on Sunday morning)")}
                                    </span>
                                  </div>
                                  <div className={styles.detailRow}>
                                    <strong>{language === "hi" ? "धारण विधि: " : "Wear On:"}</strong>
                                    <span>
                                      {gemName === "Yellow Sapphire"
                                        ? (language === "hi" ? "दाहिने हाथ की तर्जनी उंगली में सोने की धातु में पहनें।" : "Index finger of the right hand in gold metal.")
                                        : gemName === "Pearl"
                                        ? (language === "hi" ? "दाहिने हाथ की कनिष्ठिका उंगली में चांदी की धातु में पहनें।" : "Little finger of the right hand in silver metal.")
                                        : (language === "hi" ? "दाहिने हाथ की अनामिका उंगली में तांबे या सोने में पहनें।" : "Ring finger of the right hand in copper or gold.")}
                                    </span>
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                  {report.remedies?.charity && (
                    <div className={styles.charitySection}>
                      <h4 className={styles.remedyHeader}>{language === "hi" ? "वैदिक दान और प्रसाद (दान)" : "Vedic Charity & Offerings (Daan)"}</h4>
                      <div className={styles.charityGrid}>
                        <div className={styles.charityCard}>
                          <span className={styles.charityIcon}>🌾</span>
                          <div className={styles.charityText}>
                            <h5>{language === "hi" ? "पक्षियों / जानवरों को खिलाएं" : "Feed Birds / Animals"}</h5>
                            <p>{report.remedies.charity}</p>
                          </div>
                        </div>
                        <div className={styles.charityCard}>
                          <span className={styles.charityIcon}>🪔</span>
                          <div className={styles.charityText}>
                            <h5>{language === "hi" ? "दीपक अर्पण (दीया)" : "Lamp Offering (Deeya)"}</h5>
                            <p>{report.remedies.mantra}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div className={`${styles.printContainer} no-print`}>
                    <button onClick={handlePrint} className="btn-gold">
                      {t("btn_print_report")}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
      {showCheckout && (
        <CheckoutModal
          featureId="kundli"
          featureTitle={t("sec_kundli")}
          price={49}
          birthHash={getBirthHash(formData)}
          onClose={() => setShowCheckout(false)}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
}
