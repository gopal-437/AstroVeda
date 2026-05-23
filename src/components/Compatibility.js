"use client";

import React, { useState, useEffect } from "react";
import styles from "./Compatibility.module.css";
import CheckoutModal from "./CheckoutModal";
import { getBirthHash } from "@/lib/astrology-engine/helpers";
import { useTranslation } from "@/lib/LanguageContext";

export default function Compatibility() {
  // Input states
  const [formData, setFormData] = useState({
    name: "",
    dob: "",
    tob: "",
    pob: "",
    partnerName: "",
    partnerDob: "",
    partnerTob: "",
    partnerPob: ""
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState(null);
  const [token, setToken] = useState("");
  const [showCheckout, setShowCheckout] = useState(false);
  const { t, language } = useTranslation();

  // Load token from localStorage if exists
  useEffect(() => {
    if (submitted && formData.name && formData.dob && formData.partnerName && formData.partnerDob) {
      const hash = getBirthHash({
        name: formData.name,
        dob: formData.dob,
        tob: formData.tob,
        pob: formData.pob,
        partnerName: formData.partnerName,
        partnerDob: formData.partnerDob,
        partnerTob: formData.partnerTob,
        partnerPob: formData.partnerPob
      });
      const savedToken = localStorage.getItem(`token_compatibility_${hash}`);
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
          featureId: "compatibility",
          birthDetails: formData,
          token: currentToken || token,
          lang: language
        })
      });
      const data = await res.json();
      setReport(data);
    } catch (err) {
      console.error("Error fetching compatibility report:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.dob || !formData.partnerName || !formData.partnerDob) {
      alert(language === "hi" ? "कृपया सभी आवश्यक फ़ील्ड भरें।" : "Please enter all required details.");
      return;
    }
    setSubmitted(true);
    const hash = getBirthHash({
      name: formData.name,
      dob: formData.dob,
      tob: formData.tob,
      pob: formData.pob,
      partnerName: formData.partnerName,
      partnerDob: formData.partnerDob,
      partnerTob: formData.partnerTob,
      partnerPob: formData.partnerPob
    });
    const savedToken = localStorage.getItem(`token_compatibility_${hash}`) || "";
    handleFetchReport(savedToken);
  };

  const handlePaymentSuccess = (receivedToken) => {
    setToken(receivedToken);
    const hash = getBirthHash({
      name: formData.name,
      dob: formData.dob,
      tob: formData.tob,
      pob: formData.pob,
      partnerName: formData.partnerName,
      partnerDob: formData.partnerDob,
      partnerTob: formData.partnerTob,
      partnerPob: formData.partnerPob
    });
    localStorage.setItem(`token_compatibility_${hash}`, receivedToken);
    setShowCheckout(false);
    // Fetch the unlocked report immediately using the new token
    handleFetchReport(receivedToken);
  };

  const handlePrint = () => {
    document.body.classList.add("printing-compatibility");
    window.print();
  };

  useEffect(() => {
    const handleBeforePrint = () => {
      if (submitted && report && report.unlocked) {
        document.body.classList.add("printing-compatibility");
      }
    };
    const handleAfterPrint = () => {
      document.body.classList.remove("printing-compatibility");
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
  };

  // SVG Gauge calculations
  const radius = 70;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius;
  const score = report ? report.compatibilityPercentage : 0;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className={styles.container}>
      {!submitted ? (
        <form onSubmit={handleSubmit} className={styles.formGrid}>
          {/* Partner 1 Details */}
          <div className={styles.formColumn}>
            <h3 className={styles.columnTitle}>{t("form_your_details")}</h3>
            <div className={styles.inputGroup}>
              <label>{t("form_name")} <span style={{ color: "#ef4444" }}>*</span></label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder={t("form_placeholder_name")}
                required
              />
            </div>
            <div className={styles.inputRow}>
              <div className={styles.inputGroup}>
                <label>{t("form_dob")} <span style={{ color: "#ef4444" }}>*</span></label>
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
                />
              </div>
            </div>
            <div className={styles.inputGroup}>
              <label>{t("form_pob")}</label>
              <input
                type="text"
                name="pob"
                value={formData.pob}
                onChange={handleChange}
                placeholder={t("form_placeholder_pob")}
              />
            </div>
          </div>

          {/* Divider */}
          <div className={styles.versusDivider}>
            <span>⚡</span>
          </div>

          {/* Partner 2 Details */}
          <div className={styles.formColumn}>
            <h3 className={styles.columnTitle}>{t("form_partner_details")}</h3>
            <div className={styles.inputGroup}>
              <label>{t("form_name")} <span style={{ color: "#ef4444" }}>*</span></label>
              <input
                type="text"
                name="partnerName"
                value={formData.partnerName}
                onChange={handleChange}
                placeholder={t("form_placeholder_partner_name")}
                required
              />
            </div>
            <div className={styles.inputRow}>
              <div className={styles.inputGroup}>
                <label>{t("form_dob")} <span style={{ color: "#ef4444" }}>*</span></label>
                <input
                  type="date"
                  name="partnerDob"
                  value={formData.partnerDob}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className={styles.inputGroup}>
                <label>{t("form_tob")}</label>
                <input
                  type="time"
                  name="partnerTob"
                  value={formData.partnerTob}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className={styles.inputGroup}>
              <label>{t("form_pob")}</label>
              <input
                type="text"
                name="partnerPob"
                value={formData.partnerPob}
                onChange={handleChange}
                placeholder={t("form_placeholder_pob")}
              />
            </div>
          </div>

          <div className={styles.submitRow}>
            <button type="submit" className="btn-gold pulse-button">
              {t("btn_analyze_compatibility")}
            </button>
          </div>
        </form>
      ) : (
        <div className={styles.resultsArea}>
          {loading || !report ? (
            <div className={styles.loaderArea}>
              <div className="spinner"></div>
              <p>{t("loader_compatibility")}</p>
            </div>
          ) : (
            <div className={styles.reportContent}>
              <div className={`${styles.backRow} no-print`}>
                <button onClick={resetForm} className={styles.backBtn}>
                  {t("form_reset")}
                </button>
              </div>

              {/* Names header */}
              <div className={styles.namesHeader}>
                <h2>{report.name1} & {report.name2}</h2>
                <p className={styles.subSubtitle}>
                  {language === "hi" ? "राशि सिनास्ट्री: " : "Zodiac Synastry: "}{report.zodiac1} + {report.zodiac2}
                </p>
              </div>

              {/* Gauge and Sub-scores */}
              <div className={styles.gaugeScoresSection}>
                <div className={styles.gaugeContainer}>
                  <svg className={styles.svgCircle} viewBox="0 0 160 160">
                    <circle
                      cx="80"
                      cy="80"
                      r={radius}
                      strokeWidth={strokeWidth}
                      className={styles.gaugeTrack}
                    />
                    <circle
                      cx="80"
                      cy="80"
                      r={radius}
                      strokeWidth={strokeWidth}
                      className={styles.gaugeProgress}
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      transform="rotate(-90 80 80)"
                    />
                    <text x="80" y="78" className={styles.gaugeTextPct} textAnchor="middle">
                      {report.compatibilityPercentage}%
                    </text>
                    <text x="80" y="98" className={styles.gaugeTextLabel} textAnchor="middle">
                      {language === "hi" ? "मिलान" : "MATCH"}
                    </text>
                  </svg>
                </div>

                {/* Sub scores bars */}
                <div className={styles.subScoresGrid}>
                  <div className={styles.barGroup}>
                    <div className={styles.barHeader}>
                      <span>{language === "hi" ? "💖 रसायन विज्ञान और आकर्षण" : "💖 Chemistry & Attraction"}</span>
                      <span>{report.scores.love}%</span>
                    </div>
                    <div className={styles.barTrack}>
                      <div className={styles.barFillMagenta} style={{ width: `${report.scores.love}%` }}></div>
                    </div>
                  </div>

                  <div className={styles.barGroup}>
                    <div className={styles.barHeader}>
                      <span>{language === "hi" ? "🔒 विश्वास और मूल्य" : "🔒 Trust & Values"}</span>
                      <span>{report.scores.trust}%</span>
                    </div>
                    <div className={styles.barTrack}>
                      <div className={styles.barFillGold} style={{ width: `${report.scores.trust}%` }}></div>
                    </div>
                  </div>

                  <div className={styles.barGroup}>
                    <div className={styles.barHeader}>
                      <span>{language === "hi" ? "🗣️ संचार सामंजस्य" : "🗣️ Communication Harmony"}</span>
                      <span>{report.scores.communication}%</span>
                    </div>
                    <div className={styles.barTrack}>
                      <div className={styles.barFillPurple} style={{ width: `${report.scores.communication}%` }}></div>
                    </div>
                  </div>

                  <div className={styles.barGroup}>
                    <div className={styles.barHeader}>
                      <span>{language === "hi" ? "🔥 जुनून और आत्मीयता" : "🔥 Passion & Intimacy"}</span>
                      <span>{report.scores.intimacy}%</span>
                    </div>
                    <div className={styles.barTrack}>
                      <div className={styles.barFillCyan} style={{ width: `${report.scores.intimacy}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Free Teaser Content */}
              <div className={styles.teaserBlock}>
                <h4 className={styles.sectionHeader}>{language === "hi" ? "प्रारंभिक संरेखण पठन" : "Initial Alignment Reading"}</h4>
                <p className={styles.introParagraph}>{report.intro}</p>
              </div>

              {/* Locked/Unlocked Branching */}
              {!report.unlocked ? (
                /* LOCK MODAL SCREEN */
                <div className={`${styles.lockCard} no-print`}>
                  <span className={styles.lockIcon}>🔒</span>
                  <h3>{t("lock_title_compatibility")}</h3>
                  <p>{t("lock_desc_compatibility")}</p>
                  <div className={styles.pricingRow}>
                    <span className={styles.crossPrice}>₹299</span>
                    <span className={styles.activePrice}>₹19</span>
                  </div>
                  <button
                    onClick={() => setShowCheckout(true)}
                    className="btn-gold pulse-button"
                  >
                    {t("lock_btn_compatibility")}
                  </button>
                </div>
              ) : (
                /* UNLOCKED PREMIUM REPORT AREA */
                <div className={styles.premiumReport}>
                  <hr className={styles.divider} />
                  
                  <div className={styles.premiumSection}>
                    <h3 className={styles.sectionTitle}>{language === "hi" ? "विस्तृत ऊर्जावान विश्लेषण" : "Detailed Energetic Breakdown"}</h3>
                    
                    <div className={styles.detailCard}>
                      <h4>{language === "hi" ? "💖 प्रेम और रसायन विज्ञान" : "💖 Love & Chemistry"}</h4>
                      <p>{report.detailedAnalysis.love}</p>
                    </div>

                    <div className={styles.detailCard}>
                      <h4>{language === "hi" ? "🔒 विश्वास और स्थिरता" : "🔒 Trust & Stability"}</h4>
                      <p>{report.detailedAnalysis.trust}</p>
                    </div>

                    <div className={styles.detailCard}>
                      <h4>{language === "hi" ? "🗣️ संचार शैली" : "🗣️ Communication Style"}</h4>
                      <p>{report.detailedAnalysis.communication}</p>
                    </div>

                    <div className={styles.detailCard}>
                      <h4>{language === "hi" ? "🔥 जुनून और आत्मीयता" : "🔥 Passion & Intimacy"}</h4>
                      <p>{report.detailedAnalysis.intimacy}</p>
                    </div>
                  </div>

                  <div className={styles.strengthsFlagsGrid}>
                    <div className={`${styles.listCard} ${styles.strengthsCard}`}>
                      <h4>{language === "hi" ? "✦ मुख्य संरेखण ताकत" : "✦ Core Alignment Strengths"}</h4>
                      <ul>
                        {report.strengths.map((str, idx) => (
                          <li key={idx}>✅ {str}</li>
                        ))}
                      </ul>
                    </div>

                    <div className={`${styles.listCard} ${styles.flagsCard}`}>
                      <h4>{language === "hi" ? "✦ संभावित कर्मिक चेतावनी संकेत" : "✦ Potential Karmic Warning Signs"}</h4>
                      <ul>
                        {report.redFlags.map((flag, idx) => (
                          <li key={idx}>⚠️ {flag}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className={styles.timelineSection}>
                    <h3 className={styles.sectionTitle}>{language === "hi" ? "रिश्ते के विकास के मील के पत्थर" : "Relationship Growth Milestones"}</h3>
                    <div className={styles.timelineList}>
                      {report.relationshipTimeline.map((time, idx) => (
                        <div key={idx} className={styles.timelineItem}>
                          <div className={styles.timelineIndex}>0{idx + 1}</div>
                          <p>{time}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* PDF download */}
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

      {/* Razorpay / Simulation Checkout Modal */}
      {showCheckout && (
        <CheckoutModal
          featureId="compatibility"
          featureTitle={t("sec_compatibility")}
          price={19}
          birthHash={getBirthHash(formData)}
          onClose={() => setShowCheckout(false)}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
}
