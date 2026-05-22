"use client";

import React from "react";
import Header from "@/components/Header";
import { useTranslation } from "@/lib/LanguageContext";
import styles from "./policy.module.css";

export default function Contact() {
  const { t } = useTranslation();

  return (
    <div className={styles.policyContainer}>
      <Header />
      <div className={styles.starsBg}></div>
      <div className={styles.nebulaBg}></div>

      <main className={styles.policyContent}>
        <div className="cosmic-card">
          <h1 className={styles.title}>{t("contact_title")}</h1>
          <p className={styles.updated}>{t("contact_updated")}</p>
          
          <div className={styles.section}>
            <p>{t("contact_intro")}</p>
          </div>

          <div className={styles.contactDetails}>
            <div className={styles.detailCard}>
              <h3>{t("contact_email_title")}</h3>
              <p>{t("contact_email_desc")}</p>
              <a href="mailto:support@astroveda.com" className={styles.link}>support@astroveda.com</a>
            </div>

            <div className={styles.detailCard}>
              <h3>{t("contact_address_title")}</h3>
              <p>AstroVeda Portal Operations</p>
              <p>Gopal Astrological Research Labs</p>
              <p>102, Cosmic Heights, Sector 15</p>
              <p>Noida, Uttar Pradesh — 201301, India</p>
            </div>

            <div className={styles.detailCard}>
              <h3>{t("contact_hours_title")}</h3>
              <p>{t("contact_hours_desc")}</p>
              <p>{t("contact_response_time")}</p>
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
