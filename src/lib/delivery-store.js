import {
  readerDeliveryCurrent,
  readerDeliveryHistoryRows,
  readerDeliveryIssueStates,
  readerDeliveryKpis,
  readerDeliveryTimeline,
} from "@/lib/demoData";

export const DELIVERY_SAMPLE_CODES = [
  readerDeliveryCurrent.trackingId,
  readerDeliveryHistoryRows[0]?.trackingId,
].filter(Boolean);

export const normalizeTrackingCode = (value) =>
  String(value || "")
    .trim()
    .toUpperCase();

export const isValidTrackingCode = (value) =>
  /^[A-Z]{2,4}-\d{8,}$/.test(normalizeTrackingCode(value));

const baseRecord = (current) => ({
  trackingId: current.trackingId,
  edition: current.edition,
  status: current.status,
  tone: current.tone,
  eta: current.eta,
  date: current.date,
  destination: current.destination,
  note: current.note,
});

const completedTimeline = readerDeliveryTimeline.map((item) => ({
  ...item,
  badge: "Completed",
  status: "completed",
}));

const buildRegistry = () => {
  const registry = {};

  registry[readerDeliveryCurrent.trackingId] = {
    ...baseRecord(readerDeliveryCurrent),
    timeline: readerDeliveryTimeline,
  };

  readerDeliveryHistoryRows.forEach((row) => {
    registry[row.trackingId] = {
      ...baseRecord(row),
      destination: readerDeliveryCurrent.destination,
      note: "This edition completed its print run and was confirmed delivered to the saved delivery profile.",
      timeline: completedTimeline,
    };
  });

  return registry;
};

export const getCurrentDelivery = () => getDeliveryByTrackingCode(readerDeliveryCurrent.trackingId);

export const getDeliveryByTrackingCode = (rawCode) => {
  const code = normalizeTrackingCode(rawCode);
  if (!code) return null;
  return buildRegistry()[code] || null;
};

export const getDeliveryKpis = () => readerDeliveryKpis;

export const getDeliveryIssueStates = () => readerDeliveryIssueStates;

export const getRecentDeliveries = () => readerDeliveryHistoryRows;
