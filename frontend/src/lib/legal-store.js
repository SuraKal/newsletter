import { appParams } from "@/lib/app-params";
import { notifyStoreChange } from "@/lib/store-bus";

export const LEGAL_PAGE_KEYS = ["terms", "privacy", "refund", "cookies"];

export const legalStorageKey = `${appParams.storagePrefix}_legal_pages`;

// Default content for the four admin-customizable legal pages. This mirrors
// `SEEDED_LEGAL_PAGES` in `backend/seed.py` 1:1 and acts as the loading /
// offline fallback until the public `GET /legal/<key>` responds.
export const DEFAULT_LEGAL_PAGES = {
  terms: {
    key: "terms",
    eyebrow: "Terms and Service Rules",
    title: "The service terms should match how subscriptions, delivery, and access really behave.",
    intro: "",
    lastUpdated: "August 10, 2026",
    published: true,
    sections: [
      {
        heading: "Subscription billing",
        body: "Individual reader subscriptions are offered on monthly or yearly billing cycles. Business accounts may instead use negotiated or invoice-based billing arrangements.",
      },
      {
        heading: "Delivery cadence",
        body: "Billing frequency does not control newspaper arrival frequency. Active print subscribers follow the fixed two-week delivery cadence described in the product proposal.",
      },
      {
        heading: "Access timing",
        body: "Recent articles are reserved for active subscribers, while public readers gain access once the content moves beyond the 30-day delay window.",
      },
      {
        heading: "Account responsibilities",
        body: "Subscribers are responsible for keeping contact and delivery details accurate so billing and shipment routing can function correctly.",
      },
      {
        heading: "Business orders and pricing",
        body: "Business ordering may involve bulk copy counts, separate invoice handling, and volume-based pricing rules that differ from individual reader plans.",
      },
      {
        heading: "Content use",
        body: "Editorial content remains protected by copyright and may not be reproduced or redistributed commercially without permission.",
      },
    ],
    clauses: [],
    contacts: [
      { label: "Support", email: "support@newsletter.local" },
      { label: "Billing", email: "billing@newsletter.local" },
    ],
  },
  privacy: {
    key: "privacy",
    eyebrow: "Privacy and Data Use",
    title: "Privacy needs to explain billing, delivery, and consent together.",
    intro: "",
    lastUpdated: "August 11, 2026",
    published: true,
    sections: [
      {
        heading: "Data collected at sign-up",
        body: "The platform needs name, contact details, delivery address, account type, and payment references so it can create the correct subscription, delivery, and billing records.",
      },
      {
        heading: "Why delivery addresses matter",
        body: "Delivery addresses are used to determine shipment routing and may be shared with the courier or fleet-integrated logistics workflow that powers physical newspaper delivery.",
      },
      {
        heading: "How payments stay safer",
        body: "Raw card numbers should not be stored in the platform database. Payment details are expected to be captured and vaulted by a PCI-compliant processor, with the platform retaining only a reference token.",
      },
      {
        heading: "How consent should be presented",
        body: "Consent needs to be explicit at sign-up, especially when personal data supports billing, account management, and delivery coordination across Belgium and Germany.",
      },
    ],
    clauses: [
      {
        heading: "GDPR rights",
        items: [
          "Access the personal data stored for your account.",
          "Request export of your account and subscription-related data.",
          "Request deletion or retention review where legal and operational obligations allow it.",
          "Understand when address data is shared with logistics or payment partners.",
        ],
      },
      {
        heading: "Retention and deletion",
        items: [
          "Account and subscription records should be retained only as long as operational, legal, and billing obligations require.",
          "Delivery and shipment history may need limited retention to resolve disputes, missed deliveries, or account support issues.",
          "Business-account invoicing records may require longer retention than ordinary reader marketing preferences.",
        ],
      },
    ],
    contacts: [
      { label: "Privacy", email: "privacy@newsletter.local" },
      { label: "Support", email: "support@newsletter.local" },
    ],
  },
  refund: {
    key: "refund",
    eyebrow: "Refund Policy",
    title: "Subscriptions are billed as described and refunds follow the plan rules.",
    intro: "This Refund Policy explains when subscription charges can be refunded and how a refund request is handled once a charge has been made.",
    lastUpdated: "September 1, 2026",
    published: true,
    sections: [
      {
        heading: "Cancellation before renewal",
        body: "Monthly subscriptions renew automatically unless they are cancelled at least 48 hours before the next renewal date. A cancellation received before that window prevents the next charge, so no refund is needed for that cycle.",
      },
      {
        heading: "30-day annual window",
        body: "Annual subscriptions may be cancelled for a prorated refund within the first 30 days of a new annual term, minus any print copies already dispatched for the current cycle.",
      },
      {
        heading: "Print delivery issues",
        body: "If a print edition is reported as not delivered and the delivery partner confirms the miss, the affected cycle can be credited or refunded on request. Shipping and handling costs are not refundable.",
      },
      {
        heading: "Digital access correction",
        body: "Charges made in error, duplicate charges, or charges for an account that never gained access can be refunded in full when reported within 14 days.",
      },
      {
        heading: "How refunds are paid",
        body: "Approved refunds are returned to the original payment method within 10 business days and confirmed by email to the billing address on the account.",
      },
    ],
    clauses: [
      {
        heading: "Refund scenarios",
        items: [
          "Monthly cycle cancelled before the 48-hour window: no charge, no refund.",
          "Annual cancellation in the first 30 days: prorated refund.",
          "Missed print delivery verified by the delivery partner: cycle credit or refund.",
          "Duplicate or mistaken charge: full refund within 14 days.",
          "Approved refunds paid to the original method within 10 business days.",
        ],
      },
      {
        heading: "Not covered",
        items: [
          "Partial print cycles already dispatched.",
          "Reinstating a cancelled subscription without a new charge.",
          "Third-party or voucher purchases made outside the platform.",
        ],
      },
    ],
    contacts: [
      { label: "Billing", email: "billing@newsletter.local" },
      { label: "Support", email: "support@newsletter.local" },
    ],
  },
  cookies: {
    key: "cookies",
    eyebrow: "Cookies Policy",
    title: "Cookies and similar technologies keep the site working and optional tools optional.",
    intro: "This Cookies Policy explains the cookies and similar technologies used on the site, what they are for, and the choices you have.",
    lastUpdated: "September 20, 2026",
    published: true,
    sections: [
      {
        heading: "Strictly necessary",
        body: "These cookies are required for core functions such as sign-in, checking out, and keeping your session stable. They cannot be switched off.",
      },
      {
        heading: "Preferences",
        body: "These cookies remember settings like language, chosen edition, and consent choices so the site behaves consistently across visits.",
      },
      {
        heading: "Analytics",
        body: "Anonymous usage cookies help measure how articles, editions, and the checkout are used so the newsroom can improve the product. No personal data is required for these counts.",
      },
      {
        heading: "Marketing and measurement",
        body: "Optional cookies support campaign measurement and audience analysis. They are only set when you accept non-essential cookies.",
      },
    ],
    clauses: [
      {
        heading: "Your choices",
        items: [
          "Essential cookies cannot be disabled without blocking parts of the service.",
          "Preference and analytics cookies can be withdrawn from the consent settings.",
          "Marketing cookies are off by default.",
          "Refresh after changing choices so the decision applies on the next visit.",
        ],
      },
      {
        heading: "Managing cookies in your browser",
        items: [
          "Browser settings can block or delete individual cookies.",
          "Blocking essential cookies may stop sign-in and checkout from working.",
          "Most browsers apply cookie changes to new sessions.",
        ],
      },
    ],
    contacts: [
      { label: "Privacy", email: "privacy@newsletter.local" },
      { label: "Support", email: "support@newsletter.local" },
    ],
  },
};

export const getDefaultLegalPage = (key) => DEFAULT_LEGAL_PAGES[key] || null;

// Maps a backend (or locally cached) legal page payload onto the public page
// contract. The backend already serialises camelCase keys; the passthrough
// normalises arrays so the renderer never has to guard against missing shapes.
export const toLegalPage = (payload) => {
  if (!payload) {
    return null;
  }
  return {
    key: payload.key || payload.id || "",
    eyebrow: payload.eyebrow || "",
    title: payload.title || "",
    intro: payload.intro || "",
    sections: Array.isArray(payload.sections) ? payload.sections : [],
    clauses: Array.isArray(payload.clauses) ? payload.clauses : [],
    contacts: Array.isArray(payload.contacts) ? payload.contacts : [],
    lastUpdated: payload.lastUpdated || "",
    published: payload.published !== false,
  };
};

export const readLegalPages = () => {
  if (typeof window === "undefined") {
    return {};
  }
  const rawValue = window.localStorage.getItem(legalStorageKey);
  if (!rawValue) {
    return {};
  }
  try {
    return JSON.parse(rawValue);
  } catch {
    return {};
  }
};

export const writeLegalPages = (pages) => {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.setItem(legalStorageKey, JSON.stringify(pages));
  notifyStoreChange(legalStorageKey);
};

export const getLegalPage = (key) => readLegalPages()[key] || null;

export const saveLegalPage = (page) => {
  if (!page || !page.key) {
    return;
  }
  const pages = readLegalPages();
  pages[page.key] = page;
  writeLegalPages(pages);
};