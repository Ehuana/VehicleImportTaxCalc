"use strict";

const EXCHANGE_RATE = 4000;
const TERMS_VERSION = "2026-04-11-v1";

const STORAGE_KEYS = {
  theme: "vit_theme",
  language: "vit_language",
  termsStatus: "vit_terms_status",
  termsVersion: "vit_terms_version",
  termsAgreedAt: "vit_terms_agreed_at"
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

const TERMS_STATUS = {
  agreed: "agreed",
  declined: "declined",
  pending: "pending"
};

const VEHICLE_TYPES = [
  {
    hs: "8703.80",
    cd: 0,
    st: 10,
    vat: 10,
    label: {
      en: "Pure Electric Sedan",
      km: "រថយន្តស៊ីដាន់អគ្គិសនីសុទ្ធ"
    }
  },
  {
    hs: "8703.80",
    cd: 0,
    st: 10,
    vat: 10,
    label: {
      en: "Pure Electric SUV/Wagon/Other",
      km: "រថយន្ត SUV/Wagon/ប្រភេទផ្សេងៗ (អគ្គិសនីសុទ្ធ)"
    }
  },
  {
    hs: "8703.80",
    cd: 35,
    st: 10,
    vat: 10,
    label: {
      en: "Electric Go-karts",
      km: "Go-Kart អគ្គិសនី"
    }
  },
  {
    hs: "8703.80",
    cd: 35,
    st: 10,
    vat: 10,
    label: {
      en: "Electric ATVs",
      km: "ATV អគ្គិសនី"
    }
  },
  {
    hs: "8703.60",
    cd: 7,
    st: 10,
    vat: 10,
    label: {
      en: "Plug-in Hybrid Electric (PHEV)",
      km: "រថយន្ត Plug-in Hybrid (PHEV)"
    }
  },
  {
    hs: "8703.80",
    cd: 0,
    st: 0,
    vat: 10,
    label: {
      en: "Electric Ambulance",
      km: "រថយន្តសង្គ្រោះបន្ទាន់អគ្គិសនី"
    }
  },
  {
    hs: "8703.80",
    cd: 0,
    st: 0,
    vat: 10,
    label: {
      en: "Electric Hearse",
      km: "រថយន្តដឹកសពអគ្គិសនី"
    }
  },
  {
    hs: "8703.80",
    cd: 0,
    st: 0,
    vat: 10,
    label: {
      en: "Electric Prison Van",
      km: "រថយន្តដឹកអ្នកទោសអគ្គិសនី"
    }
  },
  {
    hs: "8703.23/.33",
    cd: 35,
    st: 35,
    vat: 10,
    label: {
      en: "Petrol/Diesel (Traditional ICE)",
      km: "រថយន្តសាំង/ម៉ាស៊ូត (ម៉ាស៊ីនធម្មតា)"
    }
  }
];

const TRANSLATIONS = {
  en: {
    documentTitle: "Vehicle Import Tax Calculator - Cambodia",
    eyebrow: "Unofficial Community Tool",
    mainTitle: "Vehicle Import Tax Calculator",
    subtitle: "Easy, Free to use and Open Source",
    themeDarkLabel: "Dark Mode",
    themeLightLabel: "Light Mode",
    switchToDark: "Switch to dark mode",
    switchToLight: "Switch to light mode",
    language: "Language",
    vehicleType: "Vehicle Type",
    vehicleTooltip: "Select the category of imported vehicle. The HS code and tax rates are applied automatically.",
    chooseVehicle: "Choose vehicle type",
    invalidVehicle: "Please select a vehicle type.",
    cifValue: "CIF Value (USD)",
    cifTooltip: "CIF means Cost, Insurance, and Freight. Enter the declared import value in USD.",
    cifPlaceholder: "e.g. 25000",
    invalidCif: "Please enter a valid CIF amount greater than zero.",
    liveConversionLabel: "Live conversion at 1 USD = 4,000 KHR:",
    calculateTax: "Calculate Tax",
    taxBreakdown: "Tax Breakdown",
    componentHeader: "Component",
    usdHeader: "USD",
    khrHeader: "KHR",
    formulaNote: "Formula: CD = CIF x CD%, ST = (CIF + CD) x ST%, VAT = (CIF + CD + ST) x VAT%.",
    referenceTitle: "Full Tax Rate Reference (2026)",
    toggleTable: "Show or Hide Table",
    tableVehicleType: "Vehicle Type",
    tableHsCode: "HS Code",
    tableCd: "CD",
    tableSt: "ST",
    tableVat: "VAT",
    footerNote: "Estimated values based on 2026 Customs Tariff and Sub-Decree 52.",
    creditPrefix: "Created by an independent developer. GitHub:",
    rateBadgeDefault: "HS - | CD 0% | ST 0% | VAT 10%",
    rateBadge: "HS {hs} | CD {cd}% | ST {st}% | VAT {vat}%",
    resultCif: "CIF Value",
    resultCustomsDuty: "Customs Duty (CD {rate}%)",
    resultSpecialTaxBase: "Special Tax Base (CIF + CD)",
    resultSpecialTax: "Special Tax (ST {rate}%)",
    resultVatBase: "VAT Base (CIF + CD + ST)",
    resultVat: "VAT ({rate}%)",
    resultTotalTax: "Total Tax",
    resultLandedCost: "Total Landed Cost",
    termsStatusTitle: "Terms of Use",
    termsStatusPending: "Not agreed yet.",
    termsStatusAgreed: "Agreed on {date}. You can use the calculator.",
    termsStatusDeclined: "You declined the terms. Calculator access is locked.",
    termsReviewButton: "Review Terms",
    termsViewFull: "View Full Terms",
    lockTitle: "Calculator Locked",
    lockText: "You must agree to the Terms of Use before using this calculator.",
    lockAgreeButton: "Review and Agree",
    lockOpenTermsButton: "Open Terms Page",
    termsModalTitle: "Important Notice Before Use",
    termsModalLanguageLabel: "Language",
    termsModalIntro: "This calculator provides estimates for informational purposes only.",
    termsPointAccuracy: "Tax rules, rates, and assumptions can change without notice.",
    termsPointPolicy: "Always verify final payable amounts with official Cambodia Customs sources.",
    termsPointLiability: "By continuing, you accept that the creator is not liable for losses from reliance on these estimates.",
    termsVersionText: "Terms version: {version}",
    termsReadFullButton: "Read Full Terms",
    termsDeclineButton: "Do Not Agree",
    termsAgreeButton: "I Agree and Continue",
    termsRequiredAlert: "You must agree to the Terms of Use before using this calculator."
  },
  km: {
    documentTitle: "កម្មវិធីគណនាពន្ធនាំចូលយានយន្ត - កម្ពុជា",
    eyebrow: "កម្មវិធីសាធារណៈ (មិនមែនផ្លូវការ)",
    mainTitle: "កម្មវិធីគណនាពន្ធនាំចូលយានយន្ត",
    subtitle: "ងាយស្រួលប្រើ ឥតគិតថ្លៃ និងបើកចំហ",
    themeDarkLabel: "ម៉ូតងងឹត",
    themeLightLabel: "ម៉ូតភ្លឺ",
    switchToDark: "ប្តូរទៅម៉ូតងងឹត",
    switchToLight: "ប្តូរទៅម៉ូតភ្លឺ",
    language: "ភាសា",
    vehicleType: "ប្រភេទយានយន្ត",
    vehicleTooltip: "ជ្រើសប្រភេទយានយន្តដែលនាំចូល។ កូដ HS និងអត្រាពន្ធនឹងត្រូវអនុវត្តដោយស្វ័យប្រវត្តិ។",
    chooseVehicle: "ជ្រើសប្រភេទយានយន្ត",
    invalidVehicle: "សូមជ្រើសប្រភេទយានយន្ត។",
    cifValue: "តម្លៃ CIF (USD)",
    cifTooltip: "CIF មានន័យថា តម្លៃទំនិញ + ធានារ៉ាប់រង + ថ្លៃដឹកជញ្ជូន។ សូមបញ្ចូលតម្លៃជាដុល្លារ។",
    cifPlaceholder: "ឧ. 25000",
    invalidCif: "សូមបញ្ចូលតម្លៃ CIF ត្រឹមត្រូវ និងធំជាងសូន្យ។",
    liveConversionLabel: "អត្រាប្ដូរប្រាក់បច្ចុប្បន្ន 1 USD = 4,000 KHR៖",
    calculateTax: "គណនាពន្ធ",
    taxBreakdown: "លម្អិតការគណនាពន្ធ",
    componentHeader: "ធាតុគណនា",
    usdHeader: "USD",
    khrHeader: "KHR",
    formulaNote: "រូបមន្ត៖ CD = CIF x CD%, ST = (CIF + CD) x ST%, VAT = (CIF + CD + ST) x VAT%។",
    referenceTitle: "តារាងយោងអត្រាពន្ធពេញលេញ (២០២៦)",
    toggleTable: "បង្ហាញ ឬ លាក់ តារាង",
    tableVehicleType: "ប្រភេទយានយន្ត",
    tableHsCode: "កូដ HS",
    tableCd: "CD",
    tableSt: "ST",
    tableVat: "VAT",
    footerNote: "តម្លៃទាំងនេះជាការប៉ាន់ស្មានផ្អែកលើតារាងពន្ធគយ ឆ្នាំ២០២៦ និងអនុក្រឹត្យលេខ ៥២។",
    creditPrefix: "បង្កើតដោយមនុស្សម្នាក់។ GitHub៖",
    rateBadgeDefault: "HS - | CD 0% | ST 0% | VAT 10%",
    rateBadge: "HS {hs} | CD {cd}% | ST {st}% | VAT {vat}%",
    resultCif: "តម្លៃ CIF",
    resultCustomsDuty: "ពន្ធគយ (CD {rate}%)",
    resultSpecialTaxBase: "មូលដ្ឋាន ST (CIF + CD)",
    resultSpecialTax: "ពន្ធពិសេស (ST {rate}%)",
    resultVatBase: "មូលដ្ឋាន VAT (CIF + CD + ST)",
    resultVat: "VAT ({rate}%)",
    resultTotalTax: "ពន្ធសរុប",
    resultLandedCost: "ថ្លៃចូលទីផ្សារសរុប",
    termsStatusTitle: "លក្ខខណ្ឌប្រើប្រាស់",
    termsStatusPending: "មិនទាន់យល់ព្រមនៅឡើយ។",
    termsStatusAgreed: "បានយល់ព្រមនៅ {date}។ អ្នកអាចប្រើម៉ាស៊ីនគណនា។",
    termsStatusDeclined: "អ្នកបានបដិសេធលក្ខខណ្ឌ។ ការប្រើម៉ាស៊ីនគណនាត្រូវបានចាក់សោ។",
    termsReviewButton: "ពិនិត្យលក្ខខណ្ឌ",
    termsViewFull: "មើលលក្ខខណ្ឌពេញលេញ",
    lockTitle: "ម៉ាស៊ីនគណនាត្រូវបានចាក់សោ",
    lockText: "អ្នកត្រូវយល់ព្រមលក្ខខណ្ឌប្រើប្រាស់សិន មុនពេលប្រើម៉ាស៊ីនគណនា។",
    lockAgreeButton: "ពិនិត្យ និងយល់ព្រម",
    lockOpenTermsButton: "បើកទំព័រលក្ខខណ្ឌ",
    termsModalTitle: "សេចក្តីជូនដំណឹងសំខាន់មុនប្រើប្រាស់",
    termsModalLanguageLabel: "ភាសា",
    termsModalIntro: "ម៉ាស៊ីនគណនានេះផ្តល់តែតម្លៃប៉ាន់ស្មានសម្រាប់ព័ត៌មានប៉ុណ្ណោះ។",
    termsPointAccuracy: "ច្បាប់ពន្ធ អត្រា និងការសន្មត់អាចផ្លាស់ប្តូរបានដោយគ្មានការជូនដំណឹងជាមុន។",
    termsPointPolicy: "សូមផ្ទៀងផ្ទាត់ចំនួនទឹកប្រាក់ចុងក្រោយជាមួយប្រភពផ្លូវការរបស់គយកម្ពុជា។",
    termsPointLiability: "បើអ្នកបន្តប្រើ មានន័យថាអ្នកទទួលយកថា អ្នកបង្កើតមិនទទួលខុសត្រូវលើការខាតបង់ដែលកើតពីការពឹងផ្អែកលើការប៉ាន់ស្មាននេះ។",
    termsVersionText: "កំណែលក្ខខណ្ឌ៖ {version}",
    termsReadFullButton: "អានលក្ខខណ្ឌពេញលេញ",
    termsDeclineButton: "មិនយល់ព្រម",
    termsAgreeButton: "ខ្ញុំយល់ព្រម និងបន្ត",
    termsRequiredAlert: "អ្នកត្រូវយល់ព្រមលក្ខខណ្ឌប្រើប្រាស់សិន មុនពេលប្រើម៉ាស៊ីនគណនា។"
  }
};

const taxForm = document.getElementById("taxForm");
const vehicleTypeSelect = document.getElementById("vehicleType");
const cifUsdInput = document.getElementById("cifUsd");
const cifKhrLive = document.getElementById("cifKhrLive");
const resultCard = document.getElementById("resultCard");
const resultRows = document.getElementById("resultRows");
const selectedRateInfo = document.getElementById("selectedRateInfo");
const rateTableBody = document.getElementById("rateTableBody");
const themeToggleBtn = document.getElementById("themeToggleBtn");
const themeToggleText = document.getElementById("themeToggleText");
const themeIcon = document.getElementById("themeIcon");
const languageSelect = document.getElementById("languageSelect");

const termsStatusCard = document.getElementById("termsStatusCard");
const termsStatusTitle = document.getElementById("termsStatusTitle");
const termsStatusText = document.getElementById("termsStatusText");
const termsStatusIcon = document.getElementById("termsStatusIcon");
const reviewTermsBtn = document.getElementById("reviewTermsBtn");
const viewTermsLink = document.getElementById("viewTermsLink");
const accessBlockedCard = document.getElementById("accessBlockedCard");
const accessBlockedTitle = document.getElementById("accessBlockedTitle");
const accessBlockedText = document.getElementById("accessBlockedText");
const agreeFromLockBtn = document.getElementById("agreeFromLockBtn");
const openTermsPageBtn = document.getElementById("openTermsPageBtn");

const termsModalElement = document.getElementById("termsConsentModal");
const termsModalTitle = document.getElementById("termsModalTitle");
const termsModalLanguageLabel = document.getElementById("termsModalLanguageLabel");
const termsLangBtnEn = document.getElementById("termsLangBtnEn");
const termsLangBtnKm = document.getElementById("termsLangBtnKm");
const termsModalIntro = document.getElementById("termsModalIntro");
const termsPointAccuracy = document.getElementById("termsPointAccuracy");
const termsPointPolicy = document.getElementById("termsPointPolicy");
const termsPointLiability = document.getElementById("termsPointLiability");
const termsVersionText = document.getElementById("termsVersionText");
const readFullTermsBtn = document.getElementById("readFullTermsBtn");
const declineTermsBtn = document.getElementById("declineTermsBtn");
const agreeTermsBtn = document.getElementById("agreeTermsBtn");

const textTargets = {
  eyebrowText: document.getElementById("eyebrowText"),
  mainTitle: document.getElementById("mainTitle"),
  subtitleText: document.getElementById("subtitleText"),
  languageLabel: document.getElementById("languageLabel"),
  vehicleTypeLabel: document.getElementById("vehicleTypeLabel"),
  vehicleInvalidMsg: document.getElementById("vehicleInvalidMsg"),
  cifValueLabel: document.getElementById("cifValueLabel"),
  cifInvalidMsg: document.getElementById("cifInvalidMsg"),
  liveConversionLabel: document.getElementById("liveConversionLabel"),
  calculateTaxText: document.getElementById("calculateTaxText"),
  taxBreakdownTitle: document.getElementById("taxBreakdownTitle"),
  componentHeader: document.getElementById("componentHeader"),
  usdHeader: document.getElementById("usdHeader"),
  khrHeader: document.getElementById("khrHeader"),
  formulaNote: document.getElementById("formulaNote"),
  referenceTitle: document.getElementById("referenceTitle"),
  toggleRateTableBtn: document.getElementById("toggleRateTableBtn"),
  rateHeadVehicle: document.getElementById("rateHeadVehicle"),
  rateHeadHs: document.getElementById("rateHeadHs"),
  rateHeadCd: document.getElementById("rateHeadCd"),
  rateHeadSt: document.getElementById("rateHeadSt"),
  rateHeadVat: document.getElementById("rateHeadVat"),
  footerNote: document.getElementById("footerNote"),
  creditPrefix: document.getElementById("creditPrefix")
};

const browserPrefersLight = window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches;
const browserPrefersKhmer = navigator.language && navigator.language.toLowerCase().startsWith("km");

let currentTheme = safeStorage.get(STORAGE_KEYS.theme) || (browserPrefersLight ? "light" : "dark");
let currentLanguage = safeStorage.get(STORAGE_KEYS.language) || (browserPrefersKhmer ? "km" : "en");
let currentTermsStatus = TERMS_STATUS.pending;

if (!["dark", "light"].includes(currentTheme)) {
  currentTheme = "dark";
}

if (!["en", "km"].includes(currentLanguage)) {
  currentLanguage = "en";
}

let lastResult = null;
const termsModal = new bootstrap.Modal(termsModalElement);
const usdFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
});
const khrNumberFormatters = {
  en: new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0
  }),
  km: new Intl.NumberFormat("km-KH", {
    maximumFractionDigits: 0
  })
};

function t(key, replacements = {}) {
  const dictionary = TRANSLATIONS[currentLanguage] || TRANSLATIONS.en;
  let value = dictionary[key] || TRANSLATIONS.en[key] || key;

  Object.keys(replacements).forEach((replacementKey) => {
    const token = `{${replacementKey}}`;
    value = value.replaceAll(token, String(replacements[replacementKey]));
  });

  return value;
}

function getVehicleLabel(vehicle) {
  return vehicle.label[currentLanguage] || vehicle.label.en;
}

function getTermsStatusFromStorage() {
  const storedStatus = safeStorage.get(STORAGE_KEYS.termsStatus);
  const storedVersion = safeStorage.get(STORAGE_KEYS.termsVersion);

  if (storedVersion !== TERMS_VERSION) {
    return TERMS_STATUS.pending;
  }

  if ([TERMS_STATUS.agreed, TERMS_STATUS.declined].includes(storedStatus)) {
    return storedStatus;
  }

  return TERMS_STATUS.pending;
}

function formatUSD(value) {
  return usdFormatter.format(value);
}

function formatKHR(value) {
  const formatter = currentLanguage === "km" ? khrNumberFormatters.km : khrNumberFormatters.en;
  return "KHR " + formatter.format(Math.round(value));
}

function formatAgreementDate(isoValue) {
  if (!isoValue) {
    return "-";
  }

  const parsedDate = new Date(isoValue);
  if (Number.isNaN(parsedDate.getTime())) {
    return "-";
  }

  const locale = currentLanguage === "km" ? "km-KH" : "en-GB";
  return parsedDate.toLocaleString(locale, {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  });
}

function updateLiveConversion() {
  const cif = Number.parseFloat(cifUsdInput.value);
  const khrValue = Number.isFinite(cif) && cif >= 0 ? cif * EXCHANGE_RATE : 0;
  cifKhrLive.textContent = formatKHR(khrValue);
}

function updateRateBadge(vehicle) {
  if (!vehicle) {
    selectedRateInfo.textContent = t("rateBadgeDefault");
    return;
  }

  selectedRateInfo.textContent = t("rateBadge", {
    hs: vehicle.hs,
    cd: vehicle.cd,
    st: vehicle.st,
    vat: vehicle.vat
  });
}

function populateVehicleTypes() {
  const selectedValue = vehicleTypeSelect.value;
  vehicleTypeSelect.innerHTML = "";

  const placeholderOption = document.createElement("option");
  placeholderOption.value = "";
  placeholderOption.disabled = true;
  placeholderOption.textContent = t("chooseVehicle");
  placeholderOption.selected = selectedValue === "";
  vehicleTypeSelect.append(placeholderOption);

  VEHICLE_TYPES.forEach((vehicle, index) => {
    const option = document.createElement("option");
    option.value = String(index);
    option.textContent = getVehicleLabel(vehicle);

    if (selectedValue === String(index)) {
      option.selected = true;
    }

    vehicleTypeSelect.append(option);
  });
}

function populateRateTable() {
  rateTableBody.innerHTML = VEHICLE_TYPES.map((vehicle) => {
    return `
      <tr>
        <td>${getVehicleLabel(vehicle)}</td>
        <td>${vehicle.hs}</td>
        <td class="text-end">${vehicle.cd}%</td>
        <td class="text-end">${vehicle.st}%</td>
        <td class="text-end">${vehicle.vat}%</td>
      </tr>
    `;
  }).join("");
}

function computeTax(cif, rates) {
  const customsDuty = cif * (rates.cd / 100);
  const specialTaxBase = cif + customsDuty;
  const specialTax = specialTaxBase * (rates.st / 100);
  const vatBase = cif + customsDuty + specialTax;
  const vat = vatBase * (rates.vat / 100);
  const totalTax = customsDuty + specialTax + vat;
  const landedCost = cif + totalTax;

  return {
    cif,
    customsDuty,
    specialTaxBase,
    specialTax,
    vatBase,
    vat,
    totalTax,
    landedCost
  };
}

function renderResults(vehicleIndex, data) {
  const vehicle = VEHICLE_TYPES[vehicleIndex];

  if (!vehicle) {
    return;
  }

  updateRateBadge(vehicle);

  const rows = [
    { label: t("resultCif"), usd: data.cif },
    { label: t("resultCustomsDuty", { rate: vehicle.cd }), usd: data.customsDuty },
    { label: t("resultSpecialTaxBase"), usd: data.specialTaxBase },
    { label: t("resultSpecialTax", { rate: vehicle.st }), usd: data.specialTax },
    { label: t("resultVatBase"), usd: data.vatBase },
    { label: t("resultVat", { rate: vehicle.vat }), usd: data.vat },
    { label: t("resultTotalTax"), usd: data.totalTax, emphasis: true },
    { label: t("resultLandedCost"), usd: data.landedCost, emphasis: true }
  ];

  resultRows.innerHTML = rows.map((row) => {
    const rowClass = row.emphasis ? "emphasis-row" : "";
    return `
      <tr class="${rowClass}">
        <td>${row.label}</td>
        <td class="text-end">${formatUSD(row.usd)}</td>
        <td class="text-end">${formatKHR(row.usd * EXCHANGE_RATE)}</td>
      </tr>
    `;
  }).join("");

  if (!isTermsAccepted()) {
    return;
  }

  resultCard.classList.remove("d-none");
}

function refreshTooltips() {
  const tooltipTargets = document.querySelectorAll("[data-tooltip-key]");

  tooltipTargets.forEach((el) => {
    const key = el.getAttribute("data-tooltip-key");
    const translatedText = t(key);

    const existingTooltip = bootstrap.Tooltip.getInstance(el);
    if (existingTooltip) {
      existingTooltip.dispose();
    }

    el.setAttribute("title", translatedText);
    el.setAttribute("data-bs-title", translatedText);
    new bootstrap.Tooltip(el);
  });
}

function isTermsAccepted() {
  return currentTermsStatus === TERMS_STATUS.agreed;
}

function updateTermsStatusUI() {
  termsStatusCard.classList.remove("pending", "agreed", "declined");

  termsStatusTitle.textContent = t("termsStatusTitle");
  reviewTermsBtn.textContent = t("termsReviewButton");
  viewTermsLink.textContent = t("termsViewFull");
  accessBlockedTitle.textContent = t("lockTitle");
  accessBlockedText.textContent = t("lockText");
  agreeFromLockBtn.textContent = t("lockAgreeButton");
  openTermsPageBtn.textContent = t("lockOpenTermsButton");

  const agreedAt = safeStorage.get(STORAGE_KEYS.termsAgreedAt);

  if (currentTermsStatus === TERMS_STATUS.agreed) {
    termsStatusCard.classList.add("agreed");
    termsStatusIcon.className = "fa-solid fa-circle-check";
    termsStatusText.textContent = t("termsStatusAgreed", {
      date: formatAgreementDate(agreedAt)
    });
  } else if (currentTermsStatus === TERMS_STATUS.declined) {
    termsStatusCard.classList.add("declined");
    termsStatusIcon.className = "fa-solid fa-circle-xmark";
    termsStatusText.textContent = t("termsStatusDeclined");
  } else {
    termsStatusCard.classList.add("pending");
    termsStatusIcon.className = "fa-solid fa-shield-halved";
    termsStatusText.textContent = t("termsStatusPending");
  }
}

function updateAccessState() {
  const accepted = isTermsAccepted();

  document.body.classList.toggle("terms-locked", !accepted);
  accessBlockedCard.classList.toggle("d-none", accepted);

  if (!accepted) {
    resultCard.classList.add("d-none");
  }
}

function showTermsModal() {
  termsModal.show();
}

function setTermsStatus(statusValue) {
  currentTermsStatus = statusValue;
  safeStorage.set(STORAGE_KEYS.termsStatus, statusValue);
  safeStorage.set(STORAGE_KEYS.termsVersion, TERMS_VERSION);

  if (statusValue === TERMS_STATUS.agreed) {
    safeStorage.set(STORAGE_KEYS.termsAgreedAt, new Date().toISOString());
  }

  if (statusValue !== TERMS_STATUS.agreed) {
    safeStorage.remove(STORAGE_KEYS.termsAgreedAt);
  }

  updateTermsStatusUI();
  updateAccessState();
}

function applyTheme() {
  document.documentElement.setAttribute("data-theme", currentTheme);
  const isLight = currentTheme === "light";

  themeIcon.className = isLight ? "fa-solid fa-sun me-2" : "fa-solid fa-moon me-2";
  themeToggleText.textContent = isLight ? t("themeLightLabel") : t("themeDarkLabel");

  const actionLabel = isLight ? t("switchToDark") : t("switchToLight");
  themeToggleBtn.setAttribute("title", actionLabel);
  themeToggleBtn.setAttribute("aria-label", actionLabel);
}

function updateModalLanguageSwitchUI() {
  const isEnglish = currentLanguage === "en";

  termsLangBtnEn.classList.toggle("active", isEnglish);
  termsLangBtnKm.classList.toggle("active", !isEnglish);

  termsLangBtnEn.setAttribute("aria-pressed", isEnglish ? "true" : "false");
  termsLangBtnKm.setAttribute("aria-pressed", isEnglish ? "false" : "true");
}

function applyTextTranslations() {
  document.title = t("documentTitle");
  textTargets.eyebrowText.textContent = t("eyebrow");
  textTargets.mainTitle.textContent = t("mainTitle");
  textTargets.subtitleText.textContent = t("subtitle");
  textTargets.languageLabel.textContent = t("language");
  textTargets.vehicleTypeLabel.textContent = t("vehicleType");
  textTargets.vehicleInvalidMsg.textContent = t("invalidVehicle");
  textTargets.cifValueLabel.textContent = t("cifValue");
  textTargets.cifInvalidMsg.textContent = t("invalidCif");
  textTargets.liveConversionLabel.textContent = t("liveConversionLabel");
  textTargets.calculateTaxText.textContent = t("calculateTax");
  textTargets.taxBreakdownTitle.textContent = t("taxBreakdown");
  textTargets.componentHeader.textContent = t("componentHeader");
  textTargets.usdHeader.textContent = t("usdHeader");
  textTargets.khrHeader.textContent = t("khrHeader");
  textTargets.formulaNote.textContent = t("formulaNote");
  textTargets.referenceTitle.textContent = t("referenceTitle");
  textTargets.toggleRateTableBtn.textContent = t("toggleTable");
  textTargets.rateHeadVehicle.textContent = t("tableVehicleType");
  textTargets.rateHeadHs.textContent = t("tableHsCode");
  textTargets.rateHeadCd.textContent = t("tableCd");
  textTargets.rateHeadSt.textContent = t("tableSt");
  textTargets.rateHeadVat.textContent = t("tableVat");
  textTargets.footerNote.textContent = t("footerNote");
  if (textTargets.creditPrefix) {
    textTargets.creditPrefix.textContent = t("creditPrefix");
  }

  termsModalTitle.textContent = t("termsModalTitle");
  termsModalLanguageLabel.textContent = t("termsModalLanguageLabel");
  termsModalIntro.textContent = t("termsModalIntro");
  termsPointAccuracy.textContent = t("termsPointAccuracy");
  termsPointPolicy.textContent = t("termsPointPolicy");
  termsPointLiability.textContent = t("termsPointLiability");
  termsVersionText.textContent = t("termsVersionText", { version: TERMS_VERSION });
  readFullTermsBtn.textContent = t("termsReadFullButton");
  declineTermsBtn.textContent = t("termsDeclineButton");
  agreeTermsBtn.textContent = t("termsAgreeButton");

  cifUsdInput.placeholder = t("cifPlaceholder");

  const termsPageTarget = encodeURIComponent("index.html");
  viewTermsLink.setAttribute("href", `terms.html?from=${termsPageTarget}`);
  openTermsPageBtn.setAttribute("href", `terms.html?from=${termsPageTarget}`);
  readFullTermsBtn.setAttribute("href", `terms.html?from=${termsPageTarget}`);

  updateModalLanguageSwitchUI();
  updateTermsStatusUI();
}

function applyLanguage(languageCode) {
  currentLanguage = languageCode;
  safeStorage.set(STORAGE_KEYS.language, currentLanguage);

  languageSelect.value = currentLanguage;
  document.documentElement.lang = currentLanguage === "km" ? "km" : "en";
  document.body.classList.toggle("lang-km", currentLanguage === "km");

  applyTextTranslations();
  populateVehicleTypes();
  populateRateTable();
  updateLiveConversion();
  applyTheme();
  refreshTooltips();

  if (lastResult) {
    renderResults(lastResult.vehicleIndex, lastResult.data);
  } else {
    updateRateBadge(null);
  }
}

function initializeTermsState() {
  currentTermsStatus = getTermsStatusFromStorage();
  updateTermsStatusUI();
  updateAccessState();

  if (!isTermsAccepted()) {
    showTermsModal();
  }
}

function initialize() {
  applyLanguage(currentLanguage);
  initializeTermsState();
}

themeToggleBtn.addEventListener("click", () => {
  currentTheme = currentTheme === "light" ? "dark" : "light";
  safeStorage.set(STORAGE_KEYS.theme, currentTheme);
  applyTheme();
});

languageSelect.addEventListener("change", (event) => {
  const nextLanguage = event.target.value;
  if (!["en", "km"].includes(nextLanguage)) {
    return;
  }

  applyLanguage(nextLanguage);
});

vehicleTypeSelect.addEventListener("change", () => {
  const vehicleIndex = Number.parseInt(vehicleTypeSelect.value, 10);
  if (Number.isFinite(vehicleIndex) && VEHICLE_TYPES[vehicleIndex]) {
    updateRateBadge(VEHICLE_TYPES[vehicleIndex]);
  } else {
    updateRateBadge(null);
  }
});

cifUsdInput.addEventListener("input", () => {
  updateLiveConversion();
});

reviewTermsBtn.addEventListener("click", () => {
  showTermsModal();
});

agreeFromLockBtn.addEventListener("click", () => {
  showTermsModal();
});

termsLangBtnEn.addEventListener("click", () => {
  if (currentLanguage !== "en") {
    applyLanguage("en");
  }
});

termsLangBtnKm.addEventListener("click", () => {
  if (currentLanguage !== "km") {
    applyLanguage("km");
  }
});

agreeTermsBtn.addEventListener("click", () => {
  setTermsStatus(TERMS_STATUS.agreed);
  termsModal.hide();
});

declineTermsBtn.addEventListener("click", () => {
  setTermsStatus(TERMS_STATUS.declined);
  termsModal.hide();
});

taxForm.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!isTermsAccepted()) {
    updateAccessState();
    showTermsModal();
    window.alert(t("termsRequiredAlert"));
    return;
  }

  if (!taxForm.checkValidity()) {
    taxForm.classList.add("was-validated");
    return;
  }

  const vehicleIndex = Number.parseInt(vehicleTypeSelect.value, 10);
  const cifValue = Number.parseFloat(cifUsdInput.value);

  if (!Number.isFinite(vehicleIndex) || !VEHICLE_TYPES[vehicleIndex] || !Number.isFinite(cifValue) || cifValue <= 0) {
    taxForm.classList.add("was-validated");
    return;
  }

  const taxData = computeTax(cifValue, VEHICLE_TYPES[vehicleIndex]);
  lastResult = {
    vehicleIndex,
    data: taxData
  };

  renderResults(vehicleIndex, taxData);
});

initialize();
