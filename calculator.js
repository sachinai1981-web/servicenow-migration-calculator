"use strict";

// ─── Constants ───────────────────────────────────────────────────────────────

const PERSONAL_EMAIL_DOMAINS = [
  "gmail.com",
  "yahoo.com",
  "hotmail.com",
  "outlook.com",
  "yahoo.co.uk",
  "hotmail.co.uk",
  "live.com",
  "icloud.com",
  "me.com",
  "mac.com",
  "aol.com",
  "protonmail.com",
  "mail.com",
  "inbox.com",
  "zohomail.com",
];

const FRESHSERVICE_RATE_BY_SIZE = {
  "50-500": 18,
  "500-2000": 16,
  "2000-10000": 14,
  "10000+": 12,
};

const MODULES_MULTIPLIER = {
  "1-3": 1.0,
  "4-6": 1.3,
  "7-10": 1.5,
  "10+": 1.8,
};

const TIMELINE_MULTIPLIER = {
  3: 1.4,
  6: 1.2,
  12: 1.0,
};

const FRESHSERVICE_MINIMUM_ANNUAL = 24000;
const TRAINING_COST_PER_PERSON = 800;
const MIGRATION_BASE_RATE = 0.3;

// ─── Formatters ──────────────────────────────────────────────────────────────

function formatCurrency(value) {
  return "$" + Math.round(value).toLocaleString("en-US");
}

function formatROI(value) {
  return value.toFixed(1) + "%";
}

// ─── Validation ──────────────────────────────────────────────────────────────

function isPersonalEmail(email) {
  const parts = email.trim().toLowerCase().split("@");
  if (parts.length !== 2) return true;
  return PERSONAL_EMAIL_DOMAINS.includes(parts[1]);
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

// ─── Calculation Engine ──────────────────────────────────────────────────────

function calculate(inputs) {
  const { contractValue, staffCount, modulesCount, companySize, timeline } =
    inputs;

  // ServiceNow cost — just the user-entered value
  const servicenowAnnualCost = contractValue;

  // Migration cost
  const baseMigration = servicenowAnnualCost * MIGRATION_BASE_RATE;
  const staffRetraining = staffCount * TRAINING_COST_PER_PERSON;
  const timelineMultiplier = TIMELINE_MULTIPLIER[String(timeline)] || 1.0;
  const totalMigrationCost =
    (baseMigration + staffRetraining) * timelineMultiplier;

  // Freshservice annual cost
  const ratePerAgent = FRESHSERVICE_RATE_BY_SIZE[companySize] || 18;
  const modulesMultiplier = MODULES_MULTIPLIER[modulesCount] || 1.0;
  const rawFreshserviceCost = ratePerAgent * staffCount * modulesMultiplier;
  // Note: rate is per agent per year — no extra *12 needed (already annual)
  const freshserviceAnnualCost = Math.max(
    rawFreshserviceCost,
    FRESHSERVICE_MINIMUM_ANNUAL,
  );

  // Summary figures
  const year1Total = totalMigrationCost + freshserviceAnnualCost;
  const threeYearSavings =
    servicenowAnnualCost * 3 -
    (totalMigrationCost + freshserviceAnnualCost * 3);
  const totalThreeYearSpend = totalMigrationCost + freshserviceAnnualCost * 3;
  const roi =
    totalThreeYearSpend > 0
      ? (threeYearSavings / totalThreeYearSpend) * 100
      : 0;

  return {
    servicenowAnnualCost,
    totalMigrationCost,
    freshserviceAnnualCost,
    year1Total,
    threeYearSavings,
    roi,
  };
}

// ─── DOM Helpers ─────────────────────────────────────────────────────────────

function getInputValues() {
  return {
    contractValue:
      parseFloat(document.getElementById("servicenow-contract").value) || 0,
    staffCount: parseInt(document.getElementById("it-staff").value, 10) || 0,
    modulesCount: document.getElementById("modules-in-use").value,
    companySize: document.getElementById("company-size").value,
    timeline: document.getElementById("migration-timeline").value,
  };
}

function setResultText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

function showInlineError(inputId, message) {
  const input = document.getElementById(inputId);
  if (!input) return;

  // Remove any existing error
  clearInlineError(inputId);

  const error = document.createElement("p");
  error.className = "email-error";
  error.id = inputId + "-error";
  error.style.color = "#e53e3e";
  error.style.fontSize = "0.85rem";
  error.style.marginTop = "4px";
  error.textContent = message;
  input.insertAdjacentElement("afterend", error);
  input.setAttribute("aria-describedby", error.id);
}

function clearInlineError(inputId) {
  const existing = document.getElementById(inputId + "-error");
  if (existing) existing.remove();
  const input = document.getElementById(inputId);
  if (input) input.removeAttribute("aria-describedby");
}

function renderResults(results) {
  const {
    servicenowAnnualCost,
    totalMigrationCost,
    freshserviceAnnualCost,
    year1Total,
    threeYearSavings,
    roi,
  } = results;

  setResultText("result-servicenow-cost", formatCurrency(servicenowAnnualCost));
  setResultText("result-migration-cost", formatCurrency(totalMigrationCost));
  setResultText(
    "result-freshservice-cost",
    formatCurrency(freshserviceAnnualCost),
  );
  setResultText("result-year1-total", formatCurrency(year1Total));

  if (threeYearSavings < 0) {
    setResultText(
      "result-3yr-savings",
      "Migration not recommended at this scale",
    );
    setResultText("result-roi", "N/A");
  } else {
    setResultText("result-3yr-savings", formatCurrency(threeYearSavings));
    setResultText("result-roi", formatROI(roi));
  }

  // Show results section with fade-in
  const resultsSection = document.getElementById("results-section");
  if (resultsSection) {
    resultsSection.style.display = "block";
    // Force reflow so transition fires
    void resultsSection.offsetWidth;
    resultsSection.classList.add("fade-in");
  }
}

function hideResults() {
  const resultsSection = document.getElementById("results-section");
  if (resultsSection) {
    resultsSection.classList.remove("fade-in");
    resultsSection.style.display = "none";
  }
}

function showForm() {
  const form = document.getElementById("calculator-form");
  if (form) form.style.display = "";
}

function hideForm() {
  const form = document.getElementById("calculator-form");
  if (form) form.style.display = "none";
}

// ─── LocalStorage ────────────────────────────────────────────────────────────

function persistLeadData(email, company, results) {
  const record = {
    email,
    company,
    timestamp: new Date().toISOString(),
    servicenow_cost: results.servicenowAnnualCost,
    estimated_savings: results.threeYearSavings,
  };
  try {
    localStorage.setItem("calculator_lead", JSON.stringify(record));
  } catch (_) {
    // Storage unavailable — non-fatal
  }
}

// ─── Event Handlers ──────────────────────────────────────────────────────────

function handleSubmit(event) {
  event.preventDefault();

  const emailInput = document.getElementById("work-email");
  const companyInput = document.getElementById("company-name");
  const email = emailInput ? emailInput.value.trim() : "";
  const company = companyInput ? companyInput.value.trim() : "";

  // Validate email presence and format
  if (!email || !isValidEmail(email)) {
    showInlineError("work-email", "Please enter a valid email address");
    return;
  }

  // Reject personal email domains
  if (isPersonalEmail(email)) {
    showInlineError("work-email", "Please use your work email");
    return;
  }

  clearInlineError("work-email");

  const inputs = getInputValues();
  const results = calculate(inputs);

  persistLeadData(email, company, results);

  hideForm();
  renderResults(results);
}

function handleRecalculate() {
  hideResults();
  showForm();
}

// ─── Initialisation ──────────────────────────────────────────────────────────

function init() {
  const form = document.getElementById("calculator-form");
  if (form) {
    form.addEventListener("submit", handleSubmit);
  }

  // Support a recalculate button anywhere in the document
  // Agent 1 can give it id="recalculate-btn" or the class "recalculate-btn"
  document.addEventListener("click", function (e) {
    const target = e.target;
    if (
      target.id === "recalculate-btn" ||
      (target.classList && target.classList.contains("recalculate-btn"))
    ) {
      e.preventDefault();
      handleRecalculate();
    }
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
