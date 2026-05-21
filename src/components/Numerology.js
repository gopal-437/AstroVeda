"use client";

import React, { useState, useEffect } from "react";
import styles from "./Numerology.module.css";
import CheckoutModal from "./CheckoutModal";
import { getBirthHash } from "@/lib/astrology-engine/helpers";

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
          token: currentToken || token
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
      alert("Please enter both Name and Date of Birth.");
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
              <label>Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
              />
            </div>
            <div className={styles.inputGroup}>
              <label>Date of Birth</label>
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
              Calculate Destiny Grid ✦
            </button>
          </div>
        </form>
      ) : (
        <div className={styles.resultsArea}>
          {loading || !report ? (
            <div className={styles.loaderArea}>
              <div className="spinner"></div>
              <p>Summing numerical vibratory paths...</p>
            </div>
          ) : (
            <div className={styles.reportContent}>
              <div className={`${styles.backRow} no-print`}>
                <button onClick={resetForm} className={styles.backBtn}>
                  ← Back to Calculator
                </button>
              </div>

              <div className={styles.reportHeader}>
                <h2>Pythagorean Numerology Matrix</h2>
                <p className={styles.subtitle}>Calculated for: {report.name}</p>
              </div>

              {/* Core numbers showcase */}
              <div className={styles.coresGrid}>
                {/* Life Path (Always Unlocked) */}
                <div className={styles.coreCard}>
                  <div className={styles.badgeCircle}>
                    <span className={styles.badgeLabel}>LP</span>
                    <span className={styles.badgeNum}>{report.lifePathNumber}</span>
                  </div>
                  <h3>Life Path Number</h3>
                  <p className={styles.coreTitle}>{report.lifePathTitle}</p>
                </div>

                {/* Destiny Number */}
                <div className={`${styles.coreCard} ${!report.unlocked ? styles.lockedCore : ""}`}>
                  <div className={styles.badgeCircle}>
                    <span className={styles.badgeLabel}>DEST</span>
                    <span className={styles.badgeNum}>{report.unlocked ? report.destinyNumber : "?"}</span>
                  </div>
                  <h3>Destiny / Expression</h3>
                  <p className={styles.coreTitle}>
                    {report.unlocked ? report.destinyTitle : "Locked"}
                  </p>
                </div>

                {/* Soul Urge Number */}
                <div className={`${styles.coreCard} ${!report.unlocked ? styles.lockedCore : ""}`}>
                  <div className={styles.badgeCircle}>
                    <span className={styles.badgeLabel}>SOUL</span>
                    <span className={styles.badgeNum}>{report.unlocked ? report.soulUrgeNumber : "?"}</span>
                  </div>
                  <h3>Soul Urge</h3>
                  <p className={styles.coreTitle}>
                    {report.unlocked ? report.soulUrgeTitle : "Locked"}
                  </p>
                </div>

                {/* Birth Day Number */}
                <div className={`${styles.coreCard} ${!report.unlocked ? styles.lockedCore : ""}`}>
                  <div className={styles.badgeCircle}>
                    <span className={styles.badgeLabel}>DAY</span>
                    <span className={styles.badgeNum}>{report.unlocked ? report.birthdayNumber : "?"}</span>
                  </div>
                  <h3>Birth Day Number</h3>
                  <p className={styles.coreTitle}>
                    {report.unlocked ? `Day Coordinate: ${report.birthdayNumber}` : "Locked"}
                  </p>
                </div>
              </div>

              {/* Free details (Life Path description) */}
              <div className={styles.freeSection}>
                <h4 className={styles.sectionHeader}>Your Primary Path Guidance</h4>
                <p className={styles.lpDescription}>{report.lifePathDesc}</p>
                <div className={styles.luckySummary}>
                  <span>✦ Lucky Path Seed: <strong>{report.luckyNumber}</strong></span>
                </div>
              </div>

              {/* Locked vs. Unlocked content */}
              {!report.unlocked ? (
                <div className={`${styles.lockCard} no-print`}>
                  <span className={styles.lockIcon}>🔒</span>
                  <h3>Reveal Your Complete Numerology Chart</h3>
                  <p>
                    Unlock your Destiny coordinates, Soul Urge desires, personalized Career Alignment map, Wealth & Abundance numbers, and your monthly Lucky Dates calendar.
                  </p>
                  <div className={styles.pricingRow}>
                    <span className={styles.crossPrice}>₹199</span>
                    <span className={styles.activePrice}>₹19</span>
                  </div>
                  <button
                    onClick={() => setShowCheckout(true)}
                    className="btn-gold pulse-button"
                  >
                    Unlock Numerology Report ✦
                  </button>
                </div>
              ) : (
                <div className={styles.premiumReport}>
                  <hr className={styles.divider} />

                  <div className={styles.premiumSection}>
                    <h3 className={styles.sectionTitle}>Detailed Vibrational Breakdown</h3>

                    <div className={styles.detailCard}>
                      <h4>🎯 Destiny & Expression ({report.destinyNumber})</h4>
                      <p className={styles.roleSubTitle}>Title: {report.destinyTitle}</p>
                      <p>{report.destinyDesc}</p>
                    </div>

                    <div className={styles.detailCard}>
                      <h4>💖 Vowel Soul Urge ({report.soulUrgeNumber})</h4>
                      <p className={styles.roleSubTitle}>Title: {report.soulUrgeTitle}</p>
                      <p>{report.soulUrgeDesc}</p>
                    </div>
                  </div>

                  <div className={styles.guidanceGrid}>
                    <div className={`${styles.guideCard} ${styles.careerCard}`}>
                      <h4>💼 Professional Career Alignment</h4>
                      <p>{report.careerNumerology}</p>
                    </div>

                    <div className={`${styles.guideCard} ${styles.wealthCard}`}>
                      <h4>💰 Financial Abundance Flow</h4>
                      <p>{report.wealthNumerology}</p>
                    </div>
                  </div>

                  <div className={styles.calendarSection}>
                    <h4 className={styles.sectionTitle}>Auspicious Dates & Business Alignment</h4>
                    <div className={styles.calendarCard}>
                      <div className={styles.datesList}>
                        <h5>📅 Lucky Dates of the Month</h5>
                        <ul>
                          {report.luckyDates.map((dateStr, idx) => (
                            <li key={idx}>⭐ {dateStr}</li>
                          ))}
                        </ul>
                      </div>
                      <div className={styles.businessIdea}>
                        <h5>🏢 Auspicious Business Sectors</h5>
                        <p>{report.luckyBusiness}</p>
                      </div>
                    </div>
                  </div>

                  {/* Print / Save as PDF */}
                  <div className={`${styles.printContainer} no-print`}>
                    <button onClick={handlePrint} className="btn-gold">
                      Print / Save as PDF 📄
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
          featureTitle="Numerology Chart & Report"
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
