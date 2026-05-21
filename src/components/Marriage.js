"use client";

import React, { useState, useEffect } from "react";
import styles from "./Marriage.module.css";
import CheckoutModal from "./CheckoutModal";
import { getBirthHash } from "@/lib/astrology-engine/helpers";

export default function Marriage() {
  const [formData, setFormData] = useState({
    name: "",
    dob: "",
    tob: "",
    pob: "",
    status: "single" // single, dating, married
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState(null);
  const [token, setToken] = useState("");
  const [showCheckout, setShowCheckout] = useState(false);

  // Load token from localStorage if exists
  useEffect(() => {
    if (submitted && formData.name && formData.dob) {
      const hash = getBirthHash(formData);
      const savedToken = localStorage.getItem(`token_marriage_${hash}`);
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
          featureId: "marriage",
          birthDetails: formData,
          token: currentToken || token
        })
      });
      const data = await res.json();
      setReport(data);
    } catch (err) {
      console.error("Error fetching marriage prediction:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.dob) {
      alert("Please enter Name and Date of Birth.");
      return;
    }
    setSubmitted(true);
    const hash = getBirthHash(formData);
    const savedToken = localStorage.getItem(`token_marriage_${hash}`) || "";
    handleFetchReport(savedToken);
  };

  const handlePaymentSuccess = (receivedToken) => {
    setToken(receivedToken);
    const hash = getBirthHash(formData);
    localStorage.setItem(`token_marriage_${hash}`, receivedToken);
    setShowCheckout(false);
    handleFetchReport(receivedToken);
  };

  const handlePrint = () => {
    document.body.classList.add("printing-marriage");
    window.print();
  };

  useEffect(() => {
    const handleBeforePrint = () => {
      if (submitted && report && report.unlocked) {
        document.body.classList.add("printing-marriage");
      }
    };
    const handleAfterPrint = () => {
      document.body.classList.remove("printing-marriage");
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
  const score = report?.possibilityScore || 0;
  const strokeDashoffset = circumference - (score / 100) * circumference;

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
            <div className={styles.inputGroup}>
              <label>Time of Birth</label>
              <input
                type="time"
                name="tob"
                value={formData.tob}
                onChange={handleChange}
              />
            </div>
            <div className={styles.inputGroup}>
              <label>Place of Birth</label>
              <input
                type="text"
                name="pob"
                value={formData.pob}
                onChange={handleChange}
                placeholder="City, Country"
              />
            </div>
            <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
              <label>Current Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className={styles.selectStyle}
              >
                <option value="single">Single (Seeking Union)</option>
                <option value="dating">Dating / Engaged (Predict Marriage Date)</option>
                <option value="married">Married (Strengthen Relationship Bond)</option>
              </select>
            </div>
          </div>
          <div className={styles.submitRow}>
            <button type="submit" className="btn-gold pulse-button">
              Analyze Marriage Chart 💍
            </button>
          </div>
        </form>
      ) : (
        <div className={styles.resultsArea}>
          {loading || !report ? (
            <div className={styles.loaderArea}>
              <div className="spinner"></div>
              <p>Reading Seventh House alignment for Union transits...</p>
            </div>
          ) : (
            <div className={styles.reportContent}>
              <div className={`${styles.backRow} no-print`}>
                <button onClick={resetForm} className={styles.backBtn}>
                  ← Back to Calculator
                </button>
              </div>

              <div className={styles.reportHeader}>
                <h2>Vedic Marriage Timing & Union Report</h2>
                <p className={styles.subtitle}>Calculated for: {formData.name}</p>
              </div>

              {/* Gauge and General score */}
              <div className={styles.dashboardTop}>
                <div className={styles.gaugeContainer}>
                  <svg className={styles.gaugeSvg}>
                    <defs>
                      <linearGradient id="marriageGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#ec4899" />
                        <stop offset="100%" stopColor="#f59e0b" />
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
                      stroke="url(#marriageGrad)"
                    />
                  </svg>
                  <div className={styles.gaugeVal}>
                    <span className={styles.gaugeNum}>{score}%</span>
                    <span className={styles.gaugeLabel}>Union Index</span>
                  </div>
                </div>
                
                <div className={styles.generalCard}>
                  <h4>Favorable Marriage Window</h4>
                  <div className={styles.teaserAge}>{report.generalAgeRange}</div>
                  <p className={styles.teaserHint}>
                    Based on Jupiter transits across the 7th house and D9 Navamsha calculations.
                  </p>
                </div>
              </div>

              {/* Locked Forecast timeline */}
              {!report.unlocked ? (
                <div className={`${styles.lockCard} no-print`}>
                  <span className={styles.lockIcon}>🔒</span>
                  <h3>Reveal Your Full Marriage Analysis</h3>
                  <p>
                    Unlock detailed Venus/Jupiter transit forecasts, meeting context (Love vs. Arranged probability), prospective spouse personality traits, and astrological obstacles & remedies.
                  </p>
                  <div className={styles.pricingRow}>
                    <span className={styles.crossPrice}>₹299</span>
                    <span className={styles.activePrice}>₹29</span>
                  </div>
                  <button
                    onClick={() => setShowCheckout(true)}
                    className="btn-gold pulse-button"
                  >
                    Unlock Marriage Forecast ✦
                  </button>
                </div>
              ) : (
                <div className={styles.premiumReport}>
                  <hr className={styles.divider} />

                  <div className={styles.timelineGrid}>
                    {/* Planetary Placement / Possibility Card */}
                    <div className={styles.detailCard}>
                      <div className={styles.cardHeader}>
                        <span className={styles.cardIcon}>🪐</span>
                        <h4>Seventh House Transit Alignment</h4>
                      </div>
                      <p>{report.possibilityAnalysis}</p>
                    </div>

                    {/* Marriage Type Card */}
                    <div className={styles.detailCard}>
                      <div className={styles.cardHeader}>
                        <span className={styles.cardIcon}>💝</span>
                        <h4>Meeting Context & Union Style</h4>
                      </div>
                      <p>{report.marriageType}</p>
                    </div>

                    {/* Partner Personality Card */}
                    <div className={styles.detailCard}>
                      <div className={styles.cardHeader}>
                        <span className={styles.cardIcon}>👤</span>
                        <h4>Partner Archetype & Traits</h4>
                      </div>
                      <p>{report.partnerAnalysis}</p>
                    </div>

                    {/* Obstacles & Remedies Card */}
                    <div className={styles.detailCard}>
                      <div className={styles.cardHeader}>
                        <span className={styles.cardIcon}>🛡️</span>
                        <h4>Obstacles & Astrological Remedies</h4>
                      </div>
                      <p>{report.obstaclesAnalysis}</p>
                    </div>
                  </div>

                  {/* Favorable Periods Timeline */}
                  <div className={styles.periodsSection}>
                    <h4 className={styles.periodsHeader}>Highly Active Marriage Transits</h4>
                    <div className={styles.badgesGrid}>
                      {report.favorablePeriods?.map((period, idx) => (
                        <div key={idx} className={styles.periodBadge}>
                          💍 {period}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Print Button */}
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
          featureId="marriage"
          featureTitle="Full Marriage Prediction & Timing"
          price={29}
          birthHash={getBirthHash(formData)}
          onClose={() => setShowCheckout(false)}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
}
