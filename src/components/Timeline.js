"use client";

import React, { useState, useEffect } from "react";
import styles from "./Timeline.module.css";
import CheckoutModal from "./CheckoutModal";
import { getBirthHash } from "@/lib/astrology-engine/helpers";
import { useTranslation } from "@/lib/LanguageContext";

export default function Timeline() {
  const [formData, setFormData] = useState({
    name: "",
    dob: ""
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState(null);
  const [token, setToken] = useState("");
  const [showCheckout, setShowCheckout] = useState(false);
  const [hoveredPoint, setHoveredPoint] = useState(null); // { day, score, x, y }
  const { t, language } = useTranslation();

  // Load token from localStorage if exists
  useEffect(() => {
    if (submitted && formData.name && formData.dob) {
      const hash = getBirthHash(formData);
      const savedToken = localStorage.getItem(`token_timeline_${hash}`);
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
          featureId: "timeline",
          birthDetails: formData,
          token: currentToken || token,
          lang: language
        })
      });
      const data = await res.json();
      setReport(data);
    } catch (err) {
      console.error("Error fetching timeline report:", err);
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
    const savedToken = localStorage.getItem(`token_timeline_${hash}`) || "";
    handleFetchReport(savedToken);
  };

  const handlePaymentSuccess = (receivedToken) => {
    setToken(receivedToken);
    const hash = getBirthHash(formData);
    localStorage.setItem(`token_timeline_${hash}`, receivedToken);
    setShowCheckout(false);
    handleFetchReport(receivedToken);
  };

  const handlePrint = () => {
    document.body.classList.add("printing-timeline");
    window.print();
  };

  useEffect(() => {
    const handleBeforePrint = () => {
      if (submitted && report && report.unlocked) {
        document.body.classList.add("printing-timeline");
      }
    };
    const handleAfterPrint = () => {
      document.body.classList.remove("printing-timeline");
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
    setHoveredPoint(null);
  };

  // SVG Chart Geometry
  const chartWidth = 600;
  const chartHeight = 200;
  const paddingLeft = 40;
  const paddingRight = 20;
  const paddingTop = 20;
  const paddingBottom = 30;

  const graphWidth = chartWidth - paddingLeft - paddingRight;
  const graphHeight = chartHeight - paddingTop - paddingBottom;

  // Build coordinate points from report.next30DaysGraph
  const points = [];
  const graphData = report?.next30DaysGraph || [];

  if (graphData.length > 0) {
    graphData.forEach((d, i) => {
      // x maps day 1 (index 0) to 30 (index 29)
      const x = paddingLeft + (i / 29) * graphWidth;
      // y maps score 0-100 to graphHeight-0
      const y = paddingTop + (1 - d.score / 100) * graphHeight;
      points.push({ day: d.day, score: d.score, x, y });
    });
  }

  // Draw SVG path string
  const getPathD = () => {
    if (points.length === 0) return "";
    return points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  };

  // Draw area gradient path string
  const getAreaD = () => {
    if (points.length === 0) return "";
    const startX = points[0].x;
    const endX = points[points.length - 1].x;
    const bottomY = chartHeight - paddingBottom;
    return `${getPathD()} L ${endX} ${bottomY} L ${startX} ${bottomY} Z`;
  };

  return (
    <div className={styles.container}>
      {!submitted ? (
        <form onSubmit={handleSubmit} className={styles.formContainer}>
          <div className={styles.formGrid}>
            <div className={styles.inputGroup}>
              <label>{t("form_full_name")} <span style={{ color: "#ef4444" }}>*</span></label>
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
              <label>{t("form_dob")} <span style={{ color: "#ef4444" }}>*</span></label>
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
              {t("btn_plot_timeline")}
            </button>
          </div>
        </form>
      ) : (
        <div className={styles.resultsArea}>
          {loading || !report ? (
            <div className={styles.loaderArea}>
              <div className="spinner"></div>
              <p>{t("loader_timeline")}</p>
            </div>
          ) : (
            <div className={styles.reportContent}>
              <div className={`${styles.backRow} no-print`}>
                <button onClick={resetForm} className={styles.backBtn}>
                  {t("form_reset")}
                </button>
              </div>

              <div className={styles.reportHeader}>
                <h2>{language === "hi" ? "30-दिवसीय ब्रह्मांडीय ऊर्जा समयरेखा" : "30-Day Cosmic Energy Timeline"}</h2>
                <p className={styles.subtitle}>{t("career_report_calculated_for").replace("{name}", formData.name)}</p>
              </div>

              {/* Chart Visualization */}
              <div className={styles.chartWrapper}>
                <div className={styles.chartContainer}>
                  <svg
                    viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                    className={styles.chartSvg}
                    onMouseLeave={() => setHoveredPoint(null)}
                  >
                    <defs>
                      <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#06b6d4" />
                        <stop offset="100%" stopColor="#f59e0b" />
                      </linearGradient>
                      <linearGradient id="areaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
                      </linearGradient>
                    </defs>

                    {/* Horizontal Grid lines */}
                    {[0, 25, 50, 75, 100].map((level) => {
                      const y = paddingTop + (1 - level / 100) * graphHeight;
                      return (
                        <g key={level} className={styles.gridLineGroup}>
                          <line
                            x1={paddingLeft}
                            y1={y}
                            x2={chartWidth - paddingRight}
                            y2={y}
                            className={styles.gridLine}
                          />
                          <text
                            x={paddingLeft - 10}
                            y={y + 4}
                            className={styles.gridLabel}
                          >
                            {level}
                          </text>
                        </g>
                      );
                    })}

                    {/* Plot Area & Line */}
                    {points.length > 0 && (
                      <>
                        <path d={getAreaD()} fill="url(#areaGrad)" />
                        <path
                          d={getPathD()}
                          fill="none"
                          stroke="url(#lineGrad)"
                          strokeWidth="3"
                          strokeLinecap="round"
                          className={styles.chartPath}
                        />
                      </>
                    )}

                    {/* Interactive Circles / Hover Zones */}
                    {points.map((p, idx) => {
                      // Restrict hover interaction to first 7 days if locked
                      const isLockedDay = !report.unlocked && p.day > 7;
                      return (
                        <g key={idx}>
                          {/* Visual node */}
                          {!isLockedDay && (
                            <circle
                              cx={p.x}
                              cy={p.y}
                              r="4"
                              className={`${styles.nodeCircle} ${
                                hoveredPoint?.day === p.day ? styles.nodeActive : ""
                              }`}
                            />
                          )}
                          {/* Hover trigger zone */}
                          {!isLockedDay && (
                            <rect
                              x={p.x - 10}
                              y={paddingTop}
                              width="20"
                              height={graphHeight}
                              fill="transparent"
                              className={styles.hoverRect}
                              onMouseEnter={() => setHoveredPoint(p)}
                            />
                          )}
                        </g>
                      );
                    })}

                    {/* Day axis labels */}
                    {[1, 5, 10, 15, 20, 25, 30].map((day) => {
                      const x = paddingLeft + ((day - 1) / 29) * graphWidth;
                      return (
                        <text
                          key={day}
                          x={x}
                          y={chartHeight - 10}
                          className={styles.axisLabel}
                        >
                          D{day}
                        </text>
                      );
                    })}
                  </svg>

                  {/* HTML Tooltip on hover */}
                  {hoveredPoint && (
                    <div
                      className={styles.tooltip}
                      style={{
                        left: `${(hoveredPoint.x / chartWidth) * 100}%`,
                        top: `${(hoveredPoint.y / chartHeight) * 100 - 15}%`
                      }}
                    >
                      <span className={styles.tooltipDay}>
                        {language === "hi" ? `दिन ${hoveredPoint.day}` : `Day ${hoveredPoint.day}`}
                      </span>
                      <span className={styles.tooltipVal}>
                        {language === "hi" ? `स्कोर: ${hoveredPoint.score}%` : `Score: ${hoveredPoint.score}%`}
                      </span>
                    </div>
                  )}

                  {/* Blur Overlay if Locked */}
                  {!report.unlocked && (
                    <div className={`${styles.chartBlurOverlay} no-print`}>
                      <div className={styles.blurCover}></div>
                    </div>
                  )}
                </div>
              </div>

              {/* Free Teaser Event Alert */}
              {report.highlightedEvent && (
                <div className={styles.highlightAlert}>
                  <span className={styles.alertIcon}>✦</span>
                  <div className={styles.alertText}>
                    <h5>{language === "hi" ? "ब्रह्मांडीय गोचर मुख्य अंश" : "Cosmic Transit Highlight"}</h5>
                    <p>{report.highlightedEvent}</p>
                  </div>
                </div>
              )}

              {/* Locked Forecast panels */}
              {!report.unlocked ? (
                <div className={`${styles.lockCard} no-print`}>
                  <span className={styles.lockIcon}>🔒</span>
                  <h3>{t("lock_title_timeline")}</h3>
                  <p>{t("lock_desc_timeline")}</p>
                  <div className={styles.pricingRow}>
                    <span className={styles.crossPrice}>₹299</span>
                    <span className={styles.activePrice}>₹29</span>
                  </div>
                  <button
                    onClick={() => setShowCheckout(true)}
                    className="btn-gold pulse-button"
                  >
                    {t("lock_btn_timeline")}
                  </button>
                </div>
              ) : (
                <div className={styles.premiumReport}>
                  <hr className={styles.divider} />

                  {/* Vedic Cycles Grid */}
                  {report.cycles && (
                    <div className={styles.cyclesSection}>
                      <h4 className={styles.sectionHeader}>{language === "hi" ? "ग्रहीय चक्र पूर्वानुमान" : "Planetary Cycles Forecast"}</h4>
                      <div className={styles.cyclesGrid}>
                        <div className={styles.cycleCard}>
                          <div className={styles.cycleTitle}>
                            <span>💼</span>
                            <h5>{language === "hi" ? "करियर और महत्वाकांक्षा" : "Career & Ambition"}</h5>
                          </div>
                          <p>{report.cycles.careerGrowth}</p>
                        </div>
                        <div className={styles.cycleCard}>
                          <div className={styles.cycleTitle}>
                            <span>💝</span>
                            <h5>{language === "hi" ? "रिश्ते में सामंजस्य" : "Relationship Harmony"}</h5>
                          </div>
                          <p>{report.cycles.relationshipPhases}</p>
                        </div>
                        <div className={styles.cycleCard}>
                          <div className={styles.cycleTitle}>
                            <span>💰</span>
                            <h5>{language === "hi" ? "धन संचय" : "Wealth Accumulation"}</h5>
                          </div>
                          <p>{report.cycles.financialOpportunities}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Roadmap Timeline */}
                  {report.futureRoadmap && (
                    <div className={styles.roadmapSection}>
                      <h4 className={styles.sectionHeader}>{language === "hi" ? "12-महीने का कालानुक्रमिक रोडमैप" : "12-Month Chronological Roadmap"}</h4>
                      <div className={styles.roadmapTimeline}>
                        {report.futureRoadmap.map((item, idx) => (
                          <div key={idx} className={styles.roadmapItem}>
                            <div className={styles.roadmapPeriod}>{item.period}</div>
                            <div className={styles.roadmapContent}>
                              <h5>{item.title}</h5>
                              <p>{item.detail}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

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
          featureId="timeline"
          featureTitle={t("sec_timeline")}
          price={29}
          birthHash={getBirthHash(formData)}
          onClose={() => setShowCheckout(false)}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
}
