/* global window */
"use strict";

(() => {
  const TERMS_VERSION = "2026-04-11-v1";

  const STORAGE_KEYS = {
    theme: "vit_theme",
    language: "vit_language",
    lastVehicleType: "vit_last_vehicle_type",
    lastCifUsd: "vit_last_cif_usd",
    termsStatus: "vit_terms_status",
    termsVersion: "vit_terms_version",
    termsAgreedAt: "vit_terms_agreed_at"
  };

  const TERMS_STATUS = {
    agreed: "agreed",
    declined: "declined",
    pending: "pending"
  };

  const safeStorage = {
    get(key, fallback = null) {
      try {
        const value = window.localStorage.getItem(key);
        return value ?? fallback;
      } catch {
        return fallback;
      }
    },
    set(key, value) {
      try {
        window.localStorage.setItem(key, value);
      } catch {
        // Ignore storage failures (private mode / disabled storage)
      }
    },
    remove(key) {
      try {
        window.localStorage.removeItem(key);
      } catch {
        // Ignore storage failures (private mode / disabled storage)
      }
    }
  };

  function debounce(fn, waitMs) {
    let timeoutId = null;
    return (...args) => {
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
      timeoutId = window.setTimeout(() => {
        timeoutId = null;
        fn(...args);
      }, waitMs);
    };
  }

  function getBrowserPrefersLight() {
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches;
  }

  function getBrowserPrefersKhmer() {
    return navigator.language && navigator.language.toLowerCase().startsWith("km");
  }

  function normalizeTheme(value, fallback = "dark") {
    return value === "light" || value === "dark" ? value : fallback;
  }

  function normalizeLanguage(value, fallback = "en") {
    return value === "km" || value === "en" ? value : fallback;
  }

  function getInitialTheme() {
    const browserDefault = getBrowserPrefersLight() ? "light" : "dark";
    return normalizeTheme(safeStorage.get(STORAGE_KEYS.theme) || browserDefault, browserDefault);
  }

  function getInitialLanguage() {
    const browserDefault = getBrowserPrefersKhmer() ? "km" : "en";
    return normalizeLanguage(safeStorage.get(STORAGE_KEYS.language) || browserDefault, browserDefault);
  }

  function formatAgreementDate(isoValue, languageCode = "en") {
    if (!isoValue) {
      return "-";
    }

    const parsedDate = new Date(isoValue);
    if (Number.isNaN(parsedDate.getTime())) {
      return "-";
    }

    const locale = languageCode === "km" ? "km-KH" : "en-GB";
    return parsedDate.toLocaleString(locale, {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit"
    });
  }

  window.VIT_CORE = {
    TERMS_VERSION,
    STORAGE_KEYS,
    TERMS_STATUS,
    safeStorage,
    debounce,
    normalizeTheme,
    normalizeLanguage,
    getInitialTheme,
    getInitialLanguage,
    formatAgreementDate
  };
})();

