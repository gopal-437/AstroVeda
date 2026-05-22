"use client";

import React from "react";
import Header from "@/components/Header";
import styles from "./policy.module.css";

export default function Contact() {
  return (
    <div className={styles.policyContainer}>
      <Header />
      <div className={styles.starsBg}></div>
      <div className={styles.nebulaBg}></div>

      <main className={styles.policyContent}>
        <div className="cosmic-card">
          <h1 className={styles.title}>📞 Contact Us</h1>
          <p className={styles.updated}>Last Updated: May 21, 2026</p>
          
          <div className={styles.section}>
            <p>If you have any questions, suggestions, or concerns regarding your reports, payments, or celestial charts, please feel free to reach out to us. We will get back to you within 24–48 hours.</p>
          </div>

          <div className={styles.contactDetails}>
            <div className={styles.detailCard}>
              <h3>✉️ Email Support</h3>
              <p>For transaction issues, reports, or general queries:</p>
              <a href="mailto:support@astroveda.com" className={styles.link}>support@astroveda.com</a>
            </div>

            <div className={styles.detailCard}>
              <h3>📍 Registered Address</h3>
              <p>AstroVeda Portal Operations</p>
              <p>Gopal Astrological Research Labs</p>
              <p>102, Cosmic Heights, Sector 15</p>
              <p>Noida, Uttar Pradesh — 201301, India</p>
            </div>

            <div className={styles.detailCard}>
              <h3>🕒 Support Hours</h3>
              <p>Monday to Saturday: 10:00 AM — 6:00 PM (IST)</p>
              <p>Response Time: Within 24-48 business hours.</p>
            </div>
          </div>
        </div>
      </main>

      <footer className={styles.footer}>
        <p>© 2026 AstroVeda. All rights reserved. Calculations are mathematical approximations for entertainment purposes.</p>
      </footer>
    </div>
  );
}
