"use client";

import React, { useState, useEffect } from "react";
import styles from "./Header.module.css";
import { useTranslation } from "@/lib/LanguageContext";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { language, changeLanguage, t } = useTranslation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (e, id) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ""} no-print`}>
      <div className={styles.container}>
        <div className={styles.logo} onClick={(e) => {
          setMobileMenuOpen(false);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}>
          <span className={styles.star}>✦</span>
          <span className={styles.logoText}>Astro<span className={styles.goldText}>Veda</span></span>
        </div>
        
        <nav className={`${styles.nav} ${mobileMenuOpen ? styles.navActive : ""}`}>
          <a href="#palm" onClick={(e) => handleNavClick(e, "palm")} className={styles.navLink}>{t("nav_palm")}</a>
          <a href="#love" onClick={(e) => handleNavClick(e, "love")} className={styles.navLink}>{t("nav_love")}</a>
          <a href="#marriage" onClick={(e) => handleNavClick(e, "marriage")} className={styles.navLink}>{t("nav_marriage")}</a>
          <a href="#timeline" onClick={(e) => handleNavClick(e, "timeline")} className={styles.navLink}>{t("nav_timeline")}</a>
          <a href="#kundli" onClick={(e) => handleNavClick(e, "kundli")} className={styles.navLink}>{t("nav_kundli")}</a>
          <a href="#horoscope" onClick={(e) => handleNavClick(e, "horoscope")} className={styles.navLink}>{t("nav_horoscope")}</a>
        </nav>

        <div className={styles.rightSection}>
          <div className={styles.langSelector}>
            <button 
              className={`${styles.langBtn} ${language === "en" ? styles.langActive : ""}`} 
              onClick={() => changeLanguage("en")}
            >
              EN
            </button>
            <span className={styles.langDivider}>|</span>
            <button 
              className={`${styles.langBtn} ${language === "hi" ? styles.langActive : ""}`} 
              onClick={() => changeLanguage("hi")}
            >
              हिन्दी
            </button>
          </div>

          <div className={styles.headerCta}>
            <button className="btn-gold pulse-button" onClick={(e) => handleNavClick(e, "palm")}>
              {t("nav_scan_hand")} ✦
            </button>
          </div>
        </div>

        <button 
          className={styles.menuToggle} 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <span className={`${styles.hamburger} ${mobileMenuOpen ? styles.hamburgerActive : ""}`}></span>
        </button>
      </div>
    </header>
  );
}


