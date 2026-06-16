"use client";

import { createContext, useContext, useState, useEffect } from "react";
import id from "./id.json";
import en from "./en.json";

const translations = { id, en };

const LanguageContext = createContext();

export function LanguageProvider({ children, initialLanguage = "id" }) {
  const [language, setLanguage] = useState(initialLanguage);

  useEffect(() => {
    // Apabila prop language berubah dari server, perbarui state
    setLanguage(initialLanguage);
  }, [initialLanguage]);

  const t = (key) => {
    // Fungsi translasi sederhana (e.g. t('sidebar.menu'))
    const keys = key.split(".");
    let value = translations[language];
    for (const k of keys) {
      if (value === undefined) break;
      value = value[k];
    }
    return value || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
