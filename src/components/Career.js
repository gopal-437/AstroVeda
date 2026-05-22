"use client";

import React, { useState, useEffect } from "react";
import styles from "./Career.module.css";
import CheckoutModal from "./CheckoutModal";
import { getBirthHash } from "@/lib/astrology-engine/helpers";
import { useTranslation } from "@/lib/LanguageContext";

export default function Career() {
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
  const { t, language } = useTranslation();

  // Load token from localStorage if exists
  useEffect(() => {
    if (submitted && formData.name && formData.dob) {
      const hash = getBirthHash(formData);
      const savedToken = localStorage.getItem(`token_career_${hash}`);
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
          featureId: "career",
          birthDetails: formData,
          token: currentToken || token,
          lang: language
        })
      });
      const data = await res.json();
      setReport(data);
    } catch (err) {
      console.error("Error fetching career prediction:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.dob) {
      alert(language === "hi" ? "कृपया नाम और जन्म तिथि दर्ज करें।" : "Please enter Name and Date of Birth.");
      return;
    }
    setSubmitted(true);
    const hash = getBirthHash(formData);
    const savedToken = localStorage.getItem(`token_career_${hash}`) || "";
    handleFetchReport(savedToken);
  };

  const handlePaymentSuccess = (receivedToken) => {
    setToken(receivedToken);
    const hash = getBirthHash(formData);
    localStorage.setItem(`token_career_${hash}`, receivedToken);
    setShowCheckout(false);
    handleFetchReport(receivedToken);
  };

  const handlePrint = () => {
    document.body.classList.add("printing-career");
    window.print();
  };

  useEffect(() => {
    const handleBeforePrint = () => {
      if (submitted && report && report.unlocked) {
        document.body.classList.add("printing-career");
      }
    };
    const handleAfterPrint = () => {
      document.body.classList.remove("printing-career");
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
  const circumference = 2 * Math.PI * radius;
  const score = report?.careerScore || 0;
  const strokeDashoffset = circumference - (score / 100) * circumference;

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
              />
            </div>
          </div>
          <div className={styles.submitRow}>
            <button type="submit" className="btn-gold pulse-button">
              {t("btn_analyze_career")}
            </button>
          </div>
        </form>
      ) : (
        <div className={styles.resultsArea}>
          {loading || !report ? (
            <div className={styles.loaderArea}>
              <div className="spinner"></div>
              <p>{t("loader_career")}</p>
            </div>
          ) : (
            <div className={styles.reportContent}>
              <div className={`${styles.backRow} no-print`}>
                <button onClick={resetForm} className={styles.backBtn}>
                  {t("form_reset")}
                </button>
              </div>

              <div className={styles.reportHeader}>
                <h2>{t("career_report_title")}</h2>
                <p className={styles.subtitle}>{t("career_report_calculated_for").replace("{name}", report.name)}</p>
              </div>

              {/* Gauge and General score */}
              <div className={styles.dashboardTop}>
                <div className={styles.gaugeContainer}>
                  <svg className={styles.gaugeSvg}>
                    <defs>
                      <linearGradient id="careerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#c084fc" />
                        <stop offset="100%" stopColor="#06b6d4" />
                      </linearGradient>
                    </defs>
                    <circle
                      className={styles.gaugeTrack}
                      cx="90"
                      cy="90"
                      r={radius}
                    />
                    <circle
                      className={styles.gaugeProgress}
                      cx="90"
                      cy="90"
                      r={radius}
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      stroke="url(#careerGrad)"
                    />
                  </svg>
                  <div className={styles.gaugeVal}>
                    <span className={styles.gaugeNum}>{score}%</span>
                    <span className={styles.gaugeLabel}>{t("career_strength")}</span>
                  </div>
                </div>
                
                <div className={styles.generalCard}>
                  <h4>{t("career_rating_title")}</h4>
                  <p>{report.generalInsight}</p>
                </div>
              </div>

              {/* Locked Forecast timeline */}
              {!report.unlocked ? (
                <div className={`${styles.lockCard} no-print`}>
                  <span className={styles.lockIcon}>🔒</span>
                  <h3>{t("lock_title_career")}</h3>
                  <p>{t("lock_desc_career")}</p>
                  <div className={styles.pricingRow}>
                    <span className={styles.crossPrice}>₹199</span>
                    <span className={styles.activePrice}>₹19</span>
                  </div>
                  <button
                    onClick={() => setShowCheckout(true)}
                    className="btn-gold pulse-button"
                  >
                    {t("lock_btn_career")}
                  </button>
                </div>
              ) : (
                <div className={styles.premiumReport}>
                  <hr className={styles.divider} />

                  <div className={styles.timelineGrid}>
                    {/* Job Switch Card */}
                    <div className={styles.detailCard}>
                      <div className={styles.cardHeader}>
                        <span className={styles.cardIcon}>🔄</span>
                        <h4>{t("career_switch_title")}</h4>
                      </div>
                      <p>{report.switchTiming}</p>
                    </div>

                    {/* Promotion Recognition Card */}
                    <div className={styles.detailCard}>
                      <div className={styles.cardHeader}>
                        <span className={styles.cardIcon}>📈</span>
                        <h4>{t("career_promo_title")}</h4>
                      </div>
                      <p>{report.promotionTiming}</p>
                    </div>

                    {/* Wealth Creation Card */}
                    <div className={styles.detailCard}>
                      <div className={styles.cardHeader}>
                        <span className={styles.cardIcon}>💰</span>
                        <h4>{t("career_wealth_title")}</h4>
                      </div>
                      <p>{report.wealthAnalysis}</p>
                    </div>
                  </div>

                  {/* Favorable Industries */}
                  <div className={styles.sectorsSection}>
                    <h4 className={styles.sectorsHeader}>{t("career_sectors_title")}</h4>
                    <div className={styles.badgesGrid}>
                      {report.favorableCareerDirections.map((sector, idx) => (
                        <div key={idx} className={styles.sectorBadge}>
                          ✦ {sector}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Print Button */}
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
          featureId="career"
          featureTitle={t("sec_career")}
          price={19}
          birthHash={getBirthHash(formData)}
          onClose={() => setShowCheckout(false)}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
}
