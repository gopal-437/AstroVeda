"use client";

import React, { useState, useEffect } from "react";
import styles from "./Horoscope.module.css";
import { useTranslation } from "@/lib/LanguageContext";

const ZODIACS = [
  { name: "Aries", symbol: "♈", date: "Mar 21 - Apr 19", dob: "2000-03-25" },
  { name: "Taurus", symbol: "♉", date: "Apr 20 - May 20", dob: "2000-04-25" },
  { name: "Gemini", symbol: "♊", date: "May 21 - Jun 20", dob: "2000-05-25" },
  { name: "Cancer", symbol: "♋", date: "Jun 21 - Jul 22", dob: "2000-06-25" },
  { name: "Leo", symbol: "♌", date: "Jul 23 - Aug 22", dob: "2000-07-25" },
  { name: "Virgo", symbol: "♍", date: "Aug 23 - Sep 22", dob: "2000-08-25" },
  { name: "Libra", symbol: "♎", date: "Sep 23 - Oct 22", dob: "2000-09-25" },
  { name: "Scorpio", symbol: "♏", date: "Oct 23 - Nov 21", dob: "2000-10-25" },
  { name: "Sagittarius", symbol: "♐", date: "Nov 22 - Dec 21", dob: "2000-11-25" },
  { name: "Capricorn", symbol: "♑", date: "Dec 22 - Jan 19", dob: "2000-12-25" },
  { name: "Aquarius", symbol: "♒", date: "Jan 20 - Feb 18", dob: "2000-01-25" },
  { name: "Pisces", symbol: "♓", date: "Feb 19 - Mar 20", dob: "2000-02-25" }
];

export default function Horoscope() {
  const [selectedSign, setSelectedSign] = useState(ZODIACS[0]);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const { t, language } = useTranslation();

  const fetchHoroscope = async (sign) => {
    setLoading(true);
    try {
      const res = await fetch("/api/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          featureId: "horoscope",
          birthDetails: { dob: sign.dob },
          lang: language
        })
      });
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error("Failed to fetch horoscope:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHoroscope(selectedSign);
  }, [selectedSign, language]);

  return (
    <div className={styles.container}>
      {/* Zodiac Tabs */}
      <div className={styles.zodiacTabs}>
        {ZODIACS.map((zodiac) => (
          <button
            key={zodiac.name}
            className={`${styles.tabBtn} ${selectedSign.name === zodiac.name ? styles.activeTab : ""}`}
            onClick={() => setSelectedSign(zodiac)}
          >
            <span className={styles.tabSymbol}>{zodiac.symbol}</span>
            <span className={styles.tabName}>{t("zodiac_" + zodiac.name.toLowerCase())}</span>
            <span className={styles.tabDate}>{zodiac.date}</span>
          </button>
        ))}
      </div>

      {/* Horoscope Content Display */}
      {loading || !data ? (
        <div className={styles.loaderArea}>
          <div className="spinner"></div>
          <p>{t("aligning_celestial")}</p>
        </div>
      ) : (
        <div className={styles.reportArea}>
          <div className={styles.mainInfo}>
            <div className={styles.signDisplay}>
              <span className={styles.bigSymbol}>{selectedSign.symbol}</span>
              <div>
                <h3 className={styles.signName}>{t("zodiac_" + selectedSign.name.toLowerCase())} {t("horoscope_title")}</h3>
                <p className={styles.todayDate}>{new Date().toLocaleDateString(language === "hi" ? 'hi-IN' : 'en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
              </div>
            </div>

            {/* Lucky elements */}
            <div className={styles.luckyGrid}>
              <div className={styles.luckyBadge}>
                <span className={styles.luckyLabel}>{t("lucky_color")}</span>
                <span className={`${styles.luckyVal} glow-gold`}>{data.luckyColor}</span>
              </div>
              <div className={styles.luckyBadge}>
                <span className={styles.luckyLabel}>{t("lucky_number")}</span>
                <span className={`${styles.luckyVal} glow-cyan`}>{data.luckyNumber}</span>
              </div>
            </div>
          </div>

          <div className={styles.detailsGrid}>
            {/* Core text */}
            <div className={styles.predictionText}>
              <h4 className={styles.sectionHeader}>{t("today_prediction")}</h4>
              <p>{data.predictions.general}</p>
            </div>

            {/* Mood Scores */}
            <div className={styles.scoresSection}>
              <h4 className={styles.sectionHeader}>{t("cosmic_energies")}</h4>
              <div className={styles.scoreBarGroup}>
                <div className={styles.barHeader}>
                  <span>{t("overall_mood")}</span>
                  <span>{data.scores.overall}%</span>
                </div>
                <div className={styles.barTrack}>
                  <div className={styles.barFillGold} style={{ width: `${data.scores.overall}%` }}></div>
                </div>
              </div>

              <div className={styles.scoreBarGroup}>
                <div className={styles.barHeader}>
                  <span>{t("love_connection")}</span>
                  <span>{data.scores.love}%</span>
                </div>
                <div className={styles.barTrack}>
                  <div className={styles.barFillMagenta} style={{ width: `${data.scores.love}%` }}></div>
                </div>
              </div>

              <div className={styles.scoreBarGroup}>
                <div className={styles.barHeader}>
                  <span>{t("career_ambition")}</span>
                  <span>{data.scores.career}%</span>
                </div>
                <div className={styles.barTrack}>
                  <div className={styles.barFillCyan} style={{ width: `${data.scores.career}%` }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Advice cards */}
          <div className={styles.adviceGrid}>
            <div className={`${styles.adviceCard} ${styles.loveCard}`}>
              <div className={styles.cardHeader}>
                <span>💖</span> {t("love_advice")}
              </div>
              <p>{data.predictions.love}</p>
            </div>

            <div className={`${styles.adviceCard} ${styles.careerCard}`}>
              <div className={styles.cardHeader}>
                <span>💼</span> {t("career_advice")}
              </div>
              <p>{data.predictions.career}</p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
