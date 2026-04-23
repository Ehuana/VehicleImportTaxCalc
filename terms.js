"use strict";

const CORE = window.VIT_CORE;
if (!CORE) {
  throw new Error("VIT_CORE is missing. Ensure app-core.js is loaded before terms.js.");
}

const { TERMS_VERSION, STORAGE_KEYS, TERMS_STATUS, safeStorage, getInitialTheme, getInitialLanguage } = CORE;

const TRANSLATIONS = {
  en: {
    title: "Terms and Conditions - Vehicle Import Tax Calculator",
    eyebrow: "Legal Notice",
    mainTitle: "Terms and Conditions",
    subtitle: "Please review carefully before using this calculator.",
    themeDarkLabel: "Dark Mode",
    themeLightLabel: "Light Mode",
    switchToDark: "Switch to dark mode",
    switchToLight: "Switch to light mode",
    language: "Language",
    sectionTitle: "Use of This Tax Calculator",
    termsMeta: "Terms version: {version}",
    badgePending: "Not Agreed",
    badgeAgreed: "Agreed",
    badgeDeclined: "Declined",
    agreeButton: "I Agree to the Terms",
    declineButton: "Do Not Agree",
    returnHint: "After choosing, you will be returned to the calculator."
  },
  km: {
    title: "លក្ខខណ្ឌ - ម៉ាស៊ីនគណនាពន្ធនាំចូលយានយន្ត",
    eyebrow: "សេចក្តីជូនដំណឹងផ្លូវច្បាប់",
    mainTitle: "លក្ខខណ្ឌ និង កិច្ចព្រមព្រៀង",
    subtitle: "សូមអានដោយប្រុងប្រយ័ត្ន មុនពេលប្រើម៉ាស៊ីនគណនា។",
    themeDarkLabel: "ម៉ូតងងឹត",
    themeLightLabel: "ម៉ូតភ្លឺ",
    switchToDark: "ប្តូរទៅម៉ូតងងឹត",
    switchToLight: "ប្តូរទៅម៉ូតភ្លឺ",
    language: "ភាសា",
    sectionTitle: "ការប្រើប្រាស់ម៉ាស៊ីនគណនាពន្ធនេះ",
    termsMeta: "កំណែលក្ខខណ្ឌ៖ {version}",
    badgePending: "មិនទាន់យល់ព្រម",
    badgeAgreed: "បានយល់ព្រម",
    badgeDeclined: "បានបដិសេធ",
    agreeButton: "ខ្ញុំយល់ព្រមលក្ខខណ្ឌ",
    declineButton: "មិនយល់ព្រម",
    returnHint: "បន្ទាប់ពីជ្រើសរើស របៀបនឹងត្រឡប់ទៅម៉ាស៊ីនគណនា។"
  }
};

const params = new URLSearchParams(window.location.search);
const rawReturnTarget = params.get("from") || "index.html";
const returnTarget = /^[-_./A-Za-z0-9]+\.html$/.test(rawReturnTarget) ? rawReturnTarget : "index.html";

const elements = {
  themeToggleBtn: document.getElementById("themeToggleBtn"),
  themeToggleText: document.getElementById("themeToggleText"),
  themeIcon: document.getElementById("themeIcon"),
  languageSelect: document.getElementById("languageSelect"),
  languageLabel: document.getElementById("languageLabel"),
  termsListEn: document.getElementById("termsListEn"),
  termsListKm: document.getElementById("termsListKm"),
  agreementBadge: document.getElementById("agreementBadge"),
  agreementBadgeIcon: document.getElementById("agreementBadgeIcon"),
  agreementBadgeText: document.getElementById("agreementBadgeText"),
  termsEyebrow: document.getElementById("termsEyebrow"),
  termsMainTitle: document.getElementById("termsMainTitle"),
  termsSubtitle: document.getElementById("termsSubtitle"),
  termsSectionTitle: document.getElementById("termsSectionTitle"),
  termsMeta: document.getElementById("termsMeta"),
  agreeTermsBtn: document.getElementById("agreeTermsBtn"),
  declineTermsBtn: document.getElementById("declineTermsBtn"),
  termsReturnHint: document.getElementById("termsReturnHint")
};

let currentTheme = getInitialTheme();
let currentLanguage = getInitialLanguage();

if (!["dark", "light"].includes(currentTheme)) {
  currentTheme = "dark";
}

if (!["en", "km"].includes(currentLanguage)) {
  currentLanguage = "en";
}

function t(key, replacements = {}) {
  let value = (TRANSLATIONS[currentLanguage] || TRANSLATIONS.en)[key] || TRANSLATIONS.en[key] || key;

  Object.keys(replacements).forEach((replacementKey) => {
    value = value.replaceAll(`{${replacementKey}}`, String(replacements[replacementKey]));
  });

  return value;
}

function updateAgreementBadge() {
  const status = safeStorage.get(STORAGE_KEYS.termsStatus);
  const version = safeStorage.get(STORAGE_KEYS.termsVersion);

  elements.agreementBadge.classList.remove("agreed", "declined");

  if (version === TERMS_VERSION && status === TERMS_STATUS.agreed) {
    elements.agreementBadge.classList.add("agreed");
    elements.agreementBadgeIcon.className = "fa-solid fa-circle-check";
    elements.agreementBadgeText.textContent = t("badgeAgreed");
  } else if (version === TERMS_VERSION && status === TERMS_STATUS.declined) {
    elements.agreementBadge.classList.add("declined");
    elements.agreementBadgeIcon.className = "fa-solid fa-circle-xmark";
    elements.agreementBadgeText.textContent = t("badgeDeclined");
  } else {
    elements.agreementBadgeIcon.className = "fa-solid fa-hourglass-half";
    elements.agreementBadgeText.textContent = t("badgePending");
  }
}

function applyTheme() {
  document.documentElement.setAttribute("data-theme", currentTheme);
  const isLight = currentTheme === "light";

  elements.themeIcon.className = isLight ? "fa-solid fa-sun me-2" : "fa-solid fa-moon me-2";
  elements.themeToggleText.textContent = isLight ? t("themeLightLabel") : t("themeDarkLabel");

  const actionLabel = isLight ? t("switchToDark") : t("switchToLight");
  elements.themeToggleBtn.setAttribute("title", actionLabel);
  elements.themeToggleBtn.setAttribute("aria-label", actionLabel);
}

function applyLanguage() {
  document.documentElement.lang = currentLanguage === "km" ? "km" : "en";
  document.body.classList.toggle("lang-km", currentLanguage === "km");
  document.title = t("title");

  elements.termsEyebrow.textContent = t("eyebrow");
  elements.termsMainTitle.textContent = t("mainTitle");
  elements.termsSubtitle.textContent = t("subtitle");
  elements.languageLabel.textContent = t("language");
  elements.termsSectionTitle.textContent = t("sectionTitle");
  elements.termsMeta.textContent = t("termsMeta", { version: TERMS_VERSION });
  elements.agreeTermsBtn.textContent = t("agreeButton");
  elements.declineTermsBtn.textContent = t("declineButton");
  elements.termsReturnHint.textContent = t("returnHint");

  elements.termsListEn.classList.toggle("d-none", currentLanguage === "km");
  elements.termsListKm.classList.toggle("d-none", currentLanguage !== "km");

  applyTheme();
  updateAgreementBadge();
}

function persistDecision(status) {
  safeStorage.set(STORAGE_KEYS.termsStatus, status);
  safeStorage.set(STORAGE_KEYS.termsVersion, TERMS_VERSION);

  if (status === TERMS_STATUS.agreed) {
    safeStorage.set(STORAGE_KEYS.termsAgreedAt, new Date().toISOString());
  } else {
    safeStorage.remove(STORAGE_KEYS.termsAgreedAt);
  }
}

function returnToCalculator() {
  window.location.href = returnTarget;
}

elements.agreeTermsBtn.addEventListener("click", () => {
  persistDecision(TERMS_STATUS.agreed);
  returnToCalculator();
});

elements.declineTermsBtn.addEventListener("click", () => {
  persistDecision(TERMS_STATUS.declined);
  returnToCalculator();
});

elements.themeToggleBtn.addEventListener("click", () => {
  currentTheme = currentTheme === "light" ? "dark" : "light";
  safeStorage.set(STORAGE_KEYS.theme, currentTheme);
  applyTheme();
});

elements.languageSelect.addEventListener("change", (event) => {
  const nextLanguage = event.target.value;
  if (!["en", "km"].includes(nextLanguage)) {
    return;
  }

  currentLanguage = nextLanguage;
  safeStorage.set(STORAGE_KEYS.language, currentLanguage);
  applyLanguage();
});

elements.languageSelect.value = currentLanguage;
applyLanguage();
