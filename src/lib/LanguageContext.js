"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import en from "./translations/en.json";
import hi from "./translations/hi.json";

const translations = { en, hi };

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState("en");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const savedLanguage = localStorage.getItem("astro_language");
    if (savedLanguage && (savedLanguage === "en" || savedLanguage === "hi")) {
      setLanguage(savedLanguage);
    }
    setIsMounted(true);
  }, []);

  const changeLanguage = (lang) => {
    if (lang === "en" || lang === "hi") {
      setLanguage(lang);
      localStorage.setItem("astro_language", lang);
    }
  };

  const t = (key) => {
    const dictionary = translations[language] || en;
    // Simple flat key lookup
    return dictionary[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t, isMounted }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useTranslation must be used within a LanguageProvider");
  }
  return context;
}
