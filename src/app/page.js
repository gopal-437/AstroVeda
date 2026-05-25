"use client";

import React, { useState, useEffect } from "react";
import { trackEvent } from "@/lib/analytics";
import Header from "@/components/Header";
import Horoscope from "@/components/Horoscope";
import Compatibility from "@/components/Compatibility";
import ZodiacWheel from "@/components/ZodiacWheel";
import Numerology from "@/components/Numerology";
import Career from "@/components/Career";
import PalmScanner from "@/components/PalmScanner";
import Marriage from "@/components/Marriage";
import Timeline from "@/components/Timeline";
import Kundli from "@/components/Kundli";
import { useTranslation } from "@/lib/LanguageContext";
import styles from "./page.module.css";

export default function Home() {
  // All modules collapsed by default (false)
  const [expanded, setExpanded] = useState({
    horoscope: false,
    palm: false,
    compatibility: false,
    marriage: false,
    timeline: false,
    kundli: false,
    career: false,
    numerology: false
  });
  const { t } = useTranslation();

  useEffect(() => {
    trackEvent("page_view");
  }, []);

  const toggleSection = (id) => {
    setExpanded((prev) => {
      const nextState = !prev[id];
      if (nextState) {
        trackEvent("module_view", id);
      }
      return {
        ...prev,
        [id]: nextState
      };
    });
  };

  return (
    <div className={styles.mainContainer}>
      <Header />
      
      {/* Background decoration */}
      <div className={styles.starsBg}></div>
      <div className={styles.nebulaBg}></div>

      {/* Hero Section */}
      <section className={`${styles.heroSection} no-print`}>
        <div className={styles.heroLeft}>
          <span className={styles.badge}>{t("hero_badge")}</span>
          <h1 className={styles.heroTitle}>
            {t("hero_title_1")} <span className={styles.glowText}>{t("hero_title_2")}</span>
          </h1>
          <p className={styles.heroSubtitle}>
            {t("hero_subtitle")}
          </p>
          <div className={styles.heroButtons}>
            <a href="#horoscope" className="btn-gold pulse-button">{t("hero_btn_horoscope")}</a>
            <a href="#palm" className="btn-outline">{t("hero_btn_palm")}</a>
          </div>
        </div>
        <div className={styles.heroRight}>
          <ZodiacWheel />
        </div>
      </section>

      {/* Main Features Grid - Horoscope First */}
      <main className={styles.featuresContainer}>
        
        {/* Section 1: Daily Horoscope (Free) */}
        <section
          id="horoscope"
          className={`${styles.section} cosmic-card ${
            !expanded.horoscope ? styles.sectionCollapsed : ""
          }`}
        >
          <div
            className={`${styles.sectionHeader} ${
              !expanded.horoscope ? styles.sectionHeaderCollapsed : ""
            }`}
            onClick={() => toggleSection("horoscope")}
          >
            <span className={styles.sectionIcon}>🔮</span>
            <div>
              <h2 className={styles.sectionTitle}>{t("sec_horoscope")}</h2>
              <p className={styles.sectionDesc}>{t("desc_horoscope")}</p>
            </div>
            <span className={styles.priceBadge}>Free</span>
            <span className={`${styles.arrowIcon} ${expanded.horoscope ? styles.arrowExpanded : ""}`}>
              ▼
            </span>
          </div>
          <div className={`${styles.sectionBody} ${expanded.horoscope ? styles.bodyExpanded : styles.bodyCollapsed}`}>
            <Horoscope />
          </div>
        </section>

        {/* Section 2: Cosmic Palm Scan */}
        <section
          id="palm"
          className={`${styles.section} cosmic-card ${
            !expanded.palm ? styles.sectionCollapsed : ""
          }`}
        >
          <div
            className={`${styles.sectionHeader} ${
              !expanded.palm ? styles.sectionHeaderCollapsed : ""
            }`}
            onClick={() => toggleSection("palm")}
          >
            <span className={styles.sectionIcon}>✋</span>
            <div>
              <h2 className={styles.sectionTitle}>{t("sec_palm")}</h2>
              <p className={styles.sectionDesc}>{t("desc_palm")}</p>
            </div>
            <span className={styles.priceBadge}>₹29</span>
            <span className={`${styles.arrowIcon} ${expanded.palm ? styles.arrowExpanded : ""}`}>
              ▼
            </span>
          </div>
          <div className={`${styles.sectionBody} ${expanded.palm ? styles.bodyExpanded : styles.bodyCollapsed}`}>
            <PalmScanner />
          </div>
        </section>

        {/* Section 3: Love Compatibility */}
        <section
          id="compatibility"
          className={`${styles.section} cosmic-card ${
            !expanded.compatibility ? styles.sectionCollapsed : ""
          }`}
        >
          <div
            className={`${styles.sectionHeader} ${
              !expanded.compatibility ? styles.sectionHeaderCollapsed : ""
            }`}
            onClick={() => toggleSection("compatibility")}
          >
            <span className={styles.sectionIcon}>❤️</span>
            <div>
              <h2 className={styles.sectionTitle}>{t("sec_love")}</h2>
              <p className={styles.sectionDesc}>{t("desc_love")}</p>
            </div>
            <span className={styles.priceBadge}>₹19</span>
            <span className={`${styles.arrowIcon} ${expanded.compatibility ? styles.arrowExpanded : ""}`}>
              ▼
            </span>
          </div>
          <div className={`${styles.sectionBody} ${expanded.compatibility ? styles.bodyExpanded : styles.bodyCollapsed}`}>
            <Compatibility />
          </div>
        </section>

        {/* Section 4: Marriage Prediction */}
        <section
          id="marriage"
          className={`${styles.section} cosmic-card ${
            !expanded.marriage ? styles.sectionCollapsed : ""
          }`}
        >
          <div
            className={`${styles.sectionHeader} ${
              !expanded.marriage ? styles.sectionHeaderCollapsed : ""
            }`}
            onClick={() => toggleSection("marriage")}
          >
            <span className={styles.sectionIcon}>💍</span>
            <div>
              <h2 className={styles.sectionTitle}>{t("sec_marriage")}</h2>
              <p className={styles.sectionDesc}>{t("desc_marriage")}</p>
            </div>
            <span className={styles.priceBadge}>₹29</span>
            <span className={`${styles.arrowIcon} ${expanded.marriage ? styles.arrowExpanded : ""}`}>
              ▼
            </span>
          </div>
          <div className={`${styles.sectionBody} ${expanded.marriage ? styles.bodyExpanded : styles.bodyCollapsed}`}>
            <Marriage />
          </div>
        </section>

        {/* Section 5: Future Timeline */}
        <section
          id="timeline"
          className={`${styles.section} cosmic-card ${
            !expanded.timeline ? styles.sectionCollapsed : ""
          }`}
        >
          <div
            className={`${styles.sectionHeader} ${
              !expanded.timeline ? styles.sectionHeaderCollapsed : ""
            }`}
            onClick={() => toggleSection("timeline")}
          >
            <span className={styles.sectionIcon}>📈</span>
            <div>
              <h2 className={styles.sectionTitle}>{t("sec_timeline")}</h2>
              <p className={styles.sectionDesc}>{t("desc_timeline")}</p>
            </div>
            <span className={styles.priceBadge}>₹29</span>
            <span className={`${styles.arrowIcon} ${expanded.timeline ? styles.arrowExpanded : ""}`}>
              ▼
            </span>
          </div>
          <div className={`${styles.sectionBody} ${expanded.timeline ? styles.bodyExpanded : styles.bodyCollapsed}`}>
            <Timeline />
          </div>
        </section>

        {/* Section 6: Kundli / Birth Chart */}
        <section
          id="kundli"
          className={`${styles.section} cosmic-card ${
            !expanded.kundli ? styles.sectionCollapsed : ""
          }`}
        >
          <div
            className={`${styles.sectionHeader} ${
              !expanded.kundli ? styles.sectionHeaderCollapsed : ""
            }`}
            onClick={() => toggleSection("kundli")}
          >
            <span className={styles.sectionIcon}>☸️</span>
            <div>
              <h2 className={styles.sectionTitle}>{t("sec_kundli")}</h2>
              <p className={styles.sectionDesc}>{t("desc_kundli")}</p>
            </div>
            <span className={styles.priceBadge}>₹49</span>
            <span className={`${styles.arrowIcon} ${expanded.kundli ? styles.arrowExpanded : ""}`}>
              ▼
            </span>
          </div>
          <div className={`${styles.sectionBody} ${expanded.kundli ? styles.bodyExpanded : styles.bodyCollapsed}`}>
            <Kundli />
          </div>
        </section>

        {/* Section 7: Career Prediction */}
        <section
          id="career"
          className={`${styles.section} cosmic-card ${
            !expanded.career ? styles.sectionCollapsed : ""
          }`}
        >
          <div
            className={`${styles.sectionHeader} ${
              !expanded.career ? styles.sectionHeaderCollapsed : ""
            }`}
            onClick={() => toggleSection("career")}
          >
            <span className={styles.sectionIcon}>💼</span>
            <div>
              <h2 className={styles.sectionTitle}>{t("sec_career")}</h2>
              <p className={styles.sectionDesc}>{t("desc_career")}</p>
            </div>
            <span className={styles.priceBadge}>₹19</span>
            <span className={`${styles.arrowIcon} ${expanded.career ? styles.arrowExpanded : ""}`}>
              ▼
            </span>
          </div>
          <div className={`${styles.sectionBody} ${expanded.career ? styles.bodyExpanded : styles.bodyCollapsed}`}>
            <Career />
          </div>
        </section>

        {/* Section 8: Numerology Report */}
        <section
          id="numerology"
          className={`${styles.section} cosmic-card ${
            !expanded.numerology ? styles.sectionCollapsed : ""
          }`}
        >
          <div
            className={`${styles.sectionHeader} ${
              !expanded.numerology ? styles.sectionHeaderCollapsed : ""
            }`}
            onClick={() => toggleSection("numerology")}
          >
            <span className={styles.sectionIcon}>🔢</span>
            <div>
              <h2 className={styles.sectionTitle}>{t("sec_numerology")}</h2>
              <p className={styles.sectionDesc}>{t("desc_numerology")}</p>
            </div>
            <span className={styles.priceBadge}>₹19</span>
            <span className={`${styles.arrowIcon} ${expanded.numerology ? styles.arrowExpanded : ""}`}>
              ▼
            </span>
          </div>
          <div className={`${styles.sectionBody} ${expanded.numerology ? styles.bodyExpanded : styles.bodyCollapsed}`}>
            <Numerology />
          </div>
        </section>

      </main>

      <footer className={`${styles.footer} no-print`}>
        <p>© 2026 AstroVeda. All rights reserved. Calculations are mathematical approximations for entertainment purposes.</p>
      </footer>
    </div>
  );
}
