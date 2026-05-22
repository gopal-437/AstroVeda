"use client";

import React, { useState, useEffect } from "react";
import styles from "./Numerology.module.css";
import CheckoutModal from "./CheckoutModal";
import { getBirthHash } from "@/lib/astrology-engine/helpers";
import { useTranslation } from "@/lib/LanguageContext";

export default function Numerology() {
  const [formData, setFormData] = useState({
    name: "",
    dob: ""
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState(null);
  const [token, setToken] = useState("");
  const [showCheckout, setShowCheckout] = useState(false);
  const { t, language } = useTranslation();

  // Load token from localStorage if exists
  useEffect(() => {
    if (submitted && formData.name && formData.dob) {
      const hash = getBirthHash({
        name: formData.name,
        dob: formData.dob
      });
      const savedToken = localStorage.getItem(`token_numerology_${hash}`);
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
          featureId: "numerology",
          birthDetails: {
            name: formData.name,
            dob: formData.dob
          },
          token: currentToken || token,
          lang: language
        })
      });
      const data = await res.json();
      setReport(data);
    } catch (err) {
      console.error("Error fetching numerology report:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.dob) {
      alert(language === "hi" ? "कृपया नाम और जन्म तिथि दोनों दर्ज करें।" : "Please enter both Name and Date of Birth.");
      return;
    }
    setSubmitted(true);
    const hash = getBirthHash({
      name: formData.name,
      dob: formData.dob
    });
    const savedToken = localStorage.getItem(`token_numerology_${hash}`) || "";
    handleFetchReport(savedToken);
  };

  const handlePaymentSuccess = (receivedToken) => {
    setToken(receivedToken);
    const hash = getBirthHash({
      name: formData.name,
      dob: formData.dob
    });
    localStorage.setItem(`token_numerology_${hash}`, receivedToken);
    setShowCheckout(false);
    handleFetchReport(receivedToken);
  };

  const handlePrint = () => {
    document.body.classList.add("printing-numerology");
    window.print();
  };

  useEffect(() => {
    const handleBeforePrint = () => {
      if (submitted && report && report.unlocked) {
        document.body.classList.add("printing-numerology");
      }
    };
    const handleAfterPrint = () => {
      document.body.classList.remove("printing-numerology");
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
          </div>
          <div className={styles.submitRow}>
            <button type="submit" className="btn-gold pulse-button">
              {t("btn_calculate_destiny")}
            </button>
          </div>
        </form>
      ) : (
        <div className={styles.resultsArea}>
          {loading || !report ? (
            <div className={styles.loaderArea}>
              <div className="spinner"></div>
              <p>{t("loader_numerology")}</p>
            </div>
          ) : (
            <div className={styles.reportContent}>
              <div className={`${styles.backRow} no-print`}>
                <button onClick={resetForm} className={styles.backBtn}>
                  {t("form_reset")}
                </button>
              </div>

              <div className={styles.reportHeader}>
                <h2>{t("numerology_report_title")}</h2>
                <p className={styles.subtitle}>{t("career_report_calculated_for").replace("{name}", report.name)}</p>
              </div>

              {/* Core numbers showcase */}
              <div className={styles.coresGrid}>
                {/* Life Path (Always Unlocked) */}
                <div className={styles.coreCard}>
                  <div className={styles.badgeCircle}>
                    <span className={styles.badgeLabel}>LP</span>
                    <span className={styles.badgeNum}>{report.lifePathNumber}</span>
                  </div>
                  <h3>{t("num_lifepath_num")}</h3>
                  <p className={styles.coreTitle}>{report.lifePathTitle}</p>
                </div>

                {/* Destiny Number */}
                <div className={`${styles.coreCard} ${!report.unlocked ? styles.lockedCore : ""}`}>
                  <div className={styles.badgeCircle}>
                    <span className={styles.badgeLabel}>DEST</span>
                    <span className={styles.badgeNum}>{report.unlocked ? report.destinyNumber : "?"}</span>
                  </div>
                  <h3>{t("num_destiny_num")}</h3>
                  <p className={styles.coreTitle}>
                    {report.unlocked ? report.destinyTitle : (language === "hi" ? "लॉक्ड" : "Locked")}
                  </p>
                </div>

                {/* Soul Urge Number */}
                <div className={`${styles.coreCard} ${!report.unlocked ? styles.lockedCore : ""}`}>
                  <div className={styles.badgeCircle}>
                    <span className={styles.badgeLabel}>SOUL</span>
                    <span className={styles.badgeNum}>{report.unlocked ? report.soulUrgeNumber : "?"}</span>
                  </div>
                  <h3>{t("num_soulurge_num")}</h3>
                  <p className={styles.coreTitle}>
                    {report.unlocked ? report.soulUrgeTitle : (language === "hi" ? "लॉक्ड" : "Locked")}
                  </p>
                </div>

                {/* Birth Day Number */}
                <div className={`${styles.coreCard} ${!report.unlocked ? styles.lockedCore : ""}`}>
                  <div className={styles.badgeCircle}>
                    <span className={styles.badgeLabel}>DAY</span>
                    <span className={styles.badgeNum}>{report.unlocked ? report.birthdayNumber : "?"}</span>
                  </div>
                  <h3>{t("num_birthday_num")}</h3>
                  <p className={styles.coreTitle}>
                    {report.unlocked ? t("num_birthday_coord").replace("{num}", report.birthdayNumber) : (language === "hi" ? "लॉक्ड" : "Locked")}
                  </p>
                </div>
              </div>

              {/* Free details (Life Path description) */}
              <div className={styles.freeSection}>
                <h4 className={styles.sectionHeader}>{t("num_primary_guidance")}</h4>
                <p className={styles.lpDescription}>{report.lifePathDesc}</p>
                <div className={styles.luckySummary}>
                  <span>✦ {t("num_lucky_seed").replace("{num}", report.luckyNumber)}</span>
                </div>
              </div>

              {/* Locked vs. Unlocked content */}
              {!report.unlocked ? (
                <div className={`${styles.lockCard} no-print`}>
                  <span className={styles.lockIcon}>🔒</span>
                  <h3>{t("lock_title_numerology")}</h3>
                  <p>{t("lock_desc_numerology")}</p>
                  <div className={styles.pricingRow}>
                    <span className={styles.crossPrice}>₹199</span>
                    <span className={styles.activePrice}>₹19</span>
                  </div>
                  <button
                    onClick={() => setShowCheckout(true)}
                    className="btn-gold pulse-button"
                  >
                    {t("lock_btn_numerology")}
                  </button>
                </div>
              ) : (
                <div className={styles.premiumReport}>
                  <hr className={styles.divider} />

                  <div className={styles.premiumSection}>
                    <h3 className={styles.sectionTitle}>{t("num_detail_breakdown")}</h3>

                    <div className={styles.detailCard}>
                      <h4>🎯 {t("num_destiny_num")} ({report.destinyNumber})</h4>
                      <p className={styles.roleSubTitle}>{language === "hi" ? "शीर्षक: " : "Title: "}{report.destinyTitle}</p>
                      <p>{report.destinyDesc}</p>
                    </div>

                    <div className={styles.detailCard}>
                      <h4>💖 {t("num_soulurge_num")} ({report.soulUrgeNumber})</h4>
                      <p className={styles.roleSubTitle}>{language === "hi" ? "शीर्षक: " : "Title: "}{report.soulUrgeTitle}</p>
                      <p>{report.soulUrgeDesc}</p>
                    </div>
                  </div>

                  <div className={styles.guidanceGrid}>
                    <div className={`${styles.guideCard} ${styles.careerCard}`}>
                      <h4>💼 {t("num_professional_career")}</h4>
                      <p>{report.careerNumerology}</p>
                    </div>

                    <div className={`${styles.guideCard} ${styles.wealthCard}`}>
                      <h4>💰 {t("num_financial_flow")}</h4>
                      <p>{report.wealthNumerology}</p>
                    </div>
                  </div>

                  <div className={styles.calendarSection}>
                    <h4 className={styles.sectionTitle}>{t("num_auspicious_dates")}</h4>
                    <div className={styles.calendarCard}>
                      <div className={styles.datesList}>
                        <h5>📅 {t("num_lucky_dates_month")}</h5>
                        <ul>
                          {report.luckyDates.map((dateStr, idx) => (
                            <li key={idx}>⭐ {dateStr}</li>
                          ))}
                        </ul>
                      </div>
                      <div className={styles.businessIdea}>
                        <h5>🏢 {t("num_auspicious_sectors")}</h5>
                        <p>{report.luckyBusiness}</p>
                      </div>
                    </div>
                  </div>

                  {/* Print / Save as PDF */}
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
          featureId="numerology"
          featureTitle={t("sec_numerology")}
          price={19}
          birthHash={getBirthHash({
            name: formData.name,
            dob: formData.dob
          })}
          onClose={() => setShowCheckout(false)}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
}
