"use client";

import React, { useState, useEffect } from "react";
import styles from "./Header.module.css";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (e, id) => {
    e.preventDefault();
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
        <div className={styles.logo} onClick={(e) => window.scrollTo({ top: 0, behavior: "smooth" })}>
          <span className={styles.star}>✦</span>
          <span className={styles.logoText}>Astro<span className={styles.goldText}>Veda</span></span>
        </div>
        
        <nav className={styles.nav}>
          <a href="#palm" onClick={(e) => handleNavClick(e, "palm")} className={styles.navLink}>Palm Scan</a>
          <a href="#love" onClick={(e) => handleNavClick(e, "love")} className={styles.navLink}>Love Match</a>
          <a href="#marriage" onClick={(e) => handleNavClick(e, "marriage")} className={styles.navLink}>Marriage</a>
          <a href="#timeline" onClick={(e) => handleNavClick(e, "timeline")} className={styles.navLink}>Timeline</a>
          <a href="#kundli" onClick={(e) => handleNavClick(e, "kundli")} className={styles.navLink}>Kundli</a>
          <a href="#horoscope" onClick={(e) => handleNavClick(e, "horoscope")} className={styles.navLink}>Horoscope</a>
        </nav>

        <div>
          <button className="btn-gold pulse-button" onClick={(e) => handleNavClick(e, "palm")}>
            Scan Hand ✦
          </button>
        </div>
      </div>
    </header>
  );
}
