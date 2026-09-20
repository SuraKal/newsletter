// Default payment methods served by `GET /api/v1/payment-methods`. The
// backend sends the canonical labels/details; this list is the offline
// fallback used when the backend is unreachable.
export const DEFAULT_PAYMENT_METHODS = [
  {
    id: "card",
    label: "Card",
    detail:
      "Visa, Mastercard, and American Express accepted. Card details are collected in your browser and processed through a PCI-compliant payment provider.",
  },
  {
    id: "paypal",
    label: "PayPal",
    detail:
      "Pay with your PayPal wallet and approve the recurring billing during the PayPal return.",
  },
];