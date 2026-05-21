"use client";

import React, { useState, useEffect, useRef } from "react";
import styles from "./PalmScanner.module.css";
import CheckoutModal from "./CheckoutModal";
import { getBirthHash } from "@/lib/astrology-engine/helpers";

export default function PalmScanner() {
  const [imageSrc, setImageSrc] = useState("");
  const [fileMeta, setFileMeta] = useState({ fileName: "", fileSize: 0 });
  const [scanning, setScanning] = useState(false);
  const [scanLogs, setScanLogs] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState(null);
  const [token, setToken] = useState("");
  const [showCheckout, setShowCheckout] = useState(false);
  const [activeLineTab, setActiveLineTab] = useState("all"); // 'all', 'heart', 'head', 'life'

  const fileInputRef = useRef(null);

  // Load token from localStorage if exists
  useEffect(() => {
    if (submitted && fileMeta.fileName) {
      const hash = getBirthHash({
        name: fileMeta.fileName,
        dob: String(fileMeta.fileSize)
      });
      const savedToken = localStorage.getItem(`token_palm_${hash}`);
      if (savedToken) {
        setToken(savedToken);
      }
    }
  }, [submitted, fileMeta]);

  const handleFetchReport = async (currentToken = "") => {
    setLoading(true);
    try {
      const res = await fetch("/api/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          featureId: "palm",
          birthDetails: {
            name: fileMeta.fileName,
            dob: String(fileMeta.fileSize),
            fileName: fileMeta.fileName,
            fileSize: fileMeta.fileSize
          },
          token: currentToken || token
        })
      });
      const data = await res.json();
      setReport(data);
    } catch (err) {
      console.error("Error fetching palm reading:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      setImageSrc(e.target.result);
      setFileMeta({
        fileName: file.name,
        fileSize: file.size
      });
      setSubmitted(false);
      setReport(null);
      setToken("");
    };
    reader.readAsDataURL(file);
  };

  const onDragOver = (e) => {
    e.preventDefault();
  };

  const onDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current.click();
  };

  const handleStartScan = () => {
    setScanning(true);
    setScanLogs([]);
    
    const logs = [
      "Calibrating scanner vectors...",
      "Analyzing palm surface topography...",
      "Locating Mount of Venus boundaries...",
      "Tracing Heart Line nodes...",
      "Mapping Head Line curvature...",
      "Interpolating Life Line longevity arc...",
      "Mapping complete."
    ];

    logs.forEach((logText, idx) => {
      setTimeout(() => {
        setScanLogs(prev => [...prev, logText]);
        if (idx === logs.length - 1) {
          setTimeout(() => {
            setScanning(false);
            setSubmitted(true);
            const hash = getBirthHash({
              name: fileMeta.fileName,
              dob: String(fileMeta.fileSize)
            });
            const savedToken = localStorage.getItem(`token_palm_${hash}`) || "";
            handleFetchReport(savedToken);
          }, 600);
        }
      }, (idx + 1) * 400);
    });
  };

  const handlePaymentSuccess = (receivedToken) => {
    setToken(receivedToken);
    const hash = getBirthHash({
      name: fileMeta.fileName,
      dob: String(fileMeta.fileSize)
    });
    localStorage.setItem(`token_palm_${hash}`, receivedToken);
    setShowCheckout(false);
    handleFetchReport(receivedToken);
  };

  const handlePrint = () => {
    document.body.classList.add("printing-palm");
    window.print();
  };

  useEffect(() => {
    const handleBeforePrint = () => {
      if (submitted && report && report.unlocked) {
        document.body.classList.add("printing-palm");
      }
    };
    const handleAfterPrint = () => {
      document.body.classList.remove("printing-palm");
    };
    window.addEventListener("beforeprint", handleBeforePrint);
    window.addEventListener("afterprint", handleAfterPrint);
    return () => {
      window.removeEventListener("beforeprint", handleBeforePrint);
      window.removeEventListener("afterprint", handleAfterPrint);
    };
  }, [submitted, report]);

  const resetScanner = () => {
    setImageSrc("");
    setFileMeta({ fileName: "", fileSize: 0 });
    setSubmitted(false);
    setReport(null);
    setToken("");
    setScanLogs([]);
  };

  // Helper to convert coordinate arrays to SVG polyline strings
  const getPolylinePoints = (pointsList) => {
    if (!pointsList) return "";
    return pointsList.map(p => `${p.x}%,${p.y}%`).join(" ");
  };

  return (
    <div className={styles.container}>
      {!imageSrc ? (
        // Drop area
        <div
          className={styles.dropZone}
          onDragOver={onDragOver}
          onDrop={onDrop}
          onClick={triggerFileSelect}
        >
          <span className={styles.uploadIcon}>✋</span>
          <h3>Upload an Image of your Palm</h3>
          <p>Drag and drop your file here, or click to browse</p>
          <span className={styles.uploadHint}>Supports JPG, PNG (Ensure good lighting)</span>
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => handleFileUpload(e.target.files[0])}
            accept="image/*"
            style={{ display: "none" }}
          />
        </div>
      ) : (
        <div className={styles.workspace}>
          {/* Action Row */}
          {!submitted && !scanning && (
            <div className={styles.actionRow}>
              <button onClick={resetScanner} className={styles.btnSecondary}>
                ← Upload Different Image
              </button>
              <button onClick={handleStartScan} className="btn-gold pulse-button">
                Map Palm Lines ✦
              </button>
            </div>
          )}

          {/* Scanner view */}
          <div className={styles.scanGrid}>
            <div className={styles.imageViewport}>
              <img src={imageSrc} alt="Palm upload" className={styles.palmImg} />
              
              {/* Laser Scanning Line */}
              {scanning && <div className={styles.laserBar}></div>}

              {/* Glowing Traced Lines Overlay */}
              {submitted && report && (
                <svg className={styles.svgOverlay} viewBox="0 0 100 100" preserveAspectRatio="none">
                  {/* Heart Line (Pink) */}
                  {(activeLineTab === "all" || activeLineTab === "heart") && (
                    <>
                      <polyline
                        points={getPolylinePoints(report.lines?.heart)}
                        className={`${styles.overlayLine} ${styles.heartLine}`}
                      />
                      {report.lines?.heart?.map((pt, idx) => (
                        <circle key={`heart-pt-${idx}`} cx={`${pt.x}%`} cy={`${pt.y}%`} r="1.5" className={styles.heartNode} />
                      ))}
                    </>
                  )}

                  {/* Head Line (Blue) */}
                  {(activeLineTab === "all" || activeLineTab === "head") && (
                    <>
                      <polyline
                        points={getPolylinePoints(report.lines?.head)}
                        className={`${styles.overlayLine} ${styles.headLine}`}
                      />
                      {report.lines?.head?.map((pt, idx) => (
                        <circle key={`head-pt-${idx}`} cx={`${pt.x}%`} cy={`${pt.y}%`} r="1.5" className={styles.headNode} />
                      ))}
                    </>
                  )}

                  {/* Life Line (Green) */}
                  {(activeLineTab === "all" || activeLineTab === "life") && (
                    <>
                      <polyline
                        points={getPolylinePoints(report.lines?.life)}
                        className={`${styles.overlayLine} ${styles.lifeLine}`}
                      />
                      {report.lines?.life?.map((pt, idx) => (
                        <circle key={`life-pt-${idx}`} cx={`${pt.x}%`} cy={`${pt.y}%`} r="1.5" className={styles.lifeNode} />
                      ))}
                    </>
                  )}
                </svg>
              )}
            </div>

            {/* Right side status / report panel */}
            <div className={styles.panelSide}>
              {scanning && (
                <div className={styles.consoleBox}>
                  <h4>Reading Micro-Contours</h4>
                  <div className={styles.logsList}>
                    {scanLogs.map((log, idx) => (
                      <p key={idx} className={styles.logLine}>
                        <span className={styles.logSymbol}>›</span> {log}
                      </p>
                    ))}
                  </div>
                </div>
              )}

              {submitted && !scanning && (
                <div className={styles.analysisResults}>
                  {loading || !report ? (
                    <div className={styles.spinnerArea}>
                      <div className="spinner"></div>
                      <p>Calculating mounting indices...</p>
                    </div>
                  ) : (
                    <div className={styles.readyReport}>
                      <div className={`${styles.resetHeader} no-print`}>
                        <button onClick={resetScanner} className={styles.resetBtn}>
                          ← Clear & Reset
                        </button>
                      </div>

                      <div className={styles.resultsTitle}>
                        <h3>Interactive Palm Mapping</h3>
                        <p className={styles.filenameSub}>File: {fileMeta.fileName}</p>
                      </div>

                      {/* Line Filters Tabs */}
                      <div className={`${styles.lineTabs} no-print`}>
                        <button
                          onClick={() => setActiveLineTab("all")}
                          className={`${styles.tabBtn} ${activeLineTab === "all" ? styles.tabActive : ""}`}
                        >
                          All Lines
                        </button>
                        <button
                          onClick={() => setActiveLineTab("heart")}
                          className={`${styles.tabBtn} ${styles.heartBorder} ${activeLineTab === "heart" ? styles.heartActive : ""}`}
                        >
                          ❤ Heart
                        </button>
                        <button
                          onClick={() => setActiveLineTab("head")}
                          className={`${styles.tabBtn} ${styles.headBorder} ${activeLineTab === "head" ? styles.headActive : ""}`}
                        >
                          🧠 Head
                        </button>
                        <button
                          onClick={() => setActiveLineTab("life")}
                          className={`${styles.tabBtn} ${styles.lifeBorder} ${activeLineTab === "life" ? styles.lifeActive : ""}`}
                        >
                          ⚡ Life
                        </button>
                      </div>

                      {/* Concentric Circle indicators */}
                      <div className={styles.chartBlock}>
                        <div className={styles.concentricCircles}>
                          <svg className={styles.concentricSvg} viewBox="0 0 160 160">
                            {/* Heart ring (Outer) */}
                            <circle cx="80" cy="80" r="70" className={styles.ringTrack} />
                            <circle
                              cx="80"
                              cy="80"
                              r="70"
                              className={`${styles.ringProgress} ${styles.heartProgress}`}
                              strokeDasharray={2 * Math.PI * 70}
                              strokeDashoffset={2 * Math.PI * 70 - (report.heartScore / 100) * 2 * Math.PI * 70}
                            />
                            {/* Head ring (Middle) */}
                            <circle cx="80" cy="80" r="54" className={styles.ringTrack} />
                            <circle
                              cx="80"
                              cy="80"
                              r="54"
                              className={`${styles.ringProgress} ${styles.headProgress}`}
                              strokeDasharray={2 * Math.PI * 54}
                              strokeDashoffset={2 * Math.PI * 54 - (report.headScore / 100) * 2 * Math.PI * 54}
                            />
                            {/* Life ring (Inner) */}
                            <circle cx="80" cy="80" r="38" className={styles.ringTrack} />
                            <circle
                              cx="80"
                              cy="80"
                              r="38"
                              className={`${styles.ringProgress} ${styles.lifeProgress}`}
                              strokeDasharray={2 * Math.PI * 38}
                              strokeDashoffset={2 * Math.PI * 38 - (report.lifeScore / 100) * 2 * Math.PI * 38}
                            />
                          </svg>
                          <div className={styles.ringsVal}>
                            <span className={styles.ringsLabel}>Mapped</span>
                          </div>
                        </div>

                        {/* Scores readout list */}
                        <div className={styles.scoresGrid}>
                          <div className={styles.scoreRow}>
                            <span className={`${styles.bullet} ${styles.heartBul}`}></span>
                            <span>Heart: <strong>{report.heartScore}%</strong> ({report.heartTitle})</span>
                          </div>
                          <div className={styles.scoreRow}>
                            <span className={`${styles.bullet} ${styles.headBul}`}></span>
                            <span>Head: <strong>{report.headScore}%</strong> ({report.headTitle})</span>
                          </div>
                          <div className={styles.scoreRow}>
                            <span className={`${styles.bullet} ${styles.lifeBul}`}></span>
                            <span>Life: <strong>{report.lifeScore}%</strong> ({report.lifeTitle})</span>
                          </div>
                        </div>
                      </div>

                      {/* Locked Content */}
                      {!report.unlocked ? (
                        <div className={`${styles.lockCard} no-print`}>
                          <span className={styles.lockIcon}>🔒</span>
                          <h3>Reveal Your Full Palmistry Report</h3>
                          <p>
                            Unlock deep textual character breakdown of all major lines, star ratings for your astrological mounts, and key life milestones mapped along your timeline.
                          </p>
                          <div className={styles.pricingRow}>
                            <span className={styles.crossPrice}>₹299</span>
                            <span className={styles.activePrice}>₹29</span>
                          </div>
                          <button
                            onClick={() => setShowCheckout(true)}
                            className="btn-gold pulse-button"
                          >
                            Unlock Complete Report ✦
                          </button>
                        </div>
                      ) : (
                        <div className={styles.premiumReport}>
                          <hr className={styles.divider} />

                          {/* Line Interpretations */}
                          <div className={styles.premiumSection}>
                            <h4 className={styles.sectionHeader}>Line Interpretations</h4>
                            
                            <div className={styles.detailCard}>
                              <h5 className={styles.heartText}>❤ Heart Line Description</h5>
                              <p>{report.heartDesc}</p>
                            </div>

                            <div className={styles.detailCard}>
                              <h5 className={styles.headText}>🧠 Head Line Description</h5>
                              <p>{report.headDesc}</p>
                            </div>

                            <div className={styles.detailCard}>
                              <h5 className={styles.lifeText}>⚡ Life Line Description</h5>
                              <p>{report.lifeDesc}</p>
                            </div>
                          </div>

                          {/* Astrological Mounts */}
                          <div className={styles.premiumSection}>
                            <h4 className={styles.sectionHeader}>Active Astrological Mounts</h4>
                            <div className={styles.mountsGrid}>
                              {report.mounts?.map((mount, idx) => (
                                <div key={idx} className={styles.mountCard}>
                                  <div className={styles.mountTitle}>
                                    <h5>{mount.name}</h5>
                                    <span className={styles.mountAspect}>{mount.aspect}</span>
                                  </div>
                                  <div className={styles.starsRow}>
                                    {Array.from({ length: 5 }).map((_, sIdx) => (
                                      <span
                                        key={sIdx}
                                        className={sIdx < mount.rating ? styles.starFilled : styles.starEmpty}
                                      >
                                        ★
                                      </span>
                                    ))}
                                  </div>
                                  <p className={styles.mountDesc}>{mount.desc}</p>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Age Milestones */}
                          <div className={styles.premiumSection}>
                            <h4 className={styles.sectionHeader}>Curvature Milestones Timeline</h4>
                            <div className={styles.timelineList}>
                              {report.milestones?.map((stone, idx) => (
                                <div key={idx} className={styles.timelineItem}>
                                  <div className={styles.timelineIndex}>Age {stone.age}</div>
                                  <div className={styles.timelineContent}>
                                    <h6>{stone.title}</h6>
                                    <p>{stone.desc}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Print / Save PDF */}
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
            </div>
          </div>
        </div>
      )}

      {/* Razorpay / Simulation Checkout Modal */}
      {showCheckout && (
        <CheckoutModal
          featureId="palm"
          featureTitle="Full Palm Reading & Mounts Chart"
          price={29}
          birthHash={getBirthHash({
            name: fileMeta.fileName,
            dob: String(fileMeta.fileSize)
          })}
          onClose={() => setShowCheckout(false)}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
}
