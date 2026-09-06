import React from "react";
import { DashboardTimeline, DashboardStatusBadge } from "@/components/dashboard/DashboardPrimitives";

const toneForStep = (status) => {
  if (status === "completed") {
    return "success";
  }

  if (status === "active") {
    return "info";
  }

  return "neutral";
};

export default function DeliveryTimelinePanel({
  title,
  description,
  items,
}) {
  const timelineItems = items.map((item) => ({
    ...item,
    completed: item.status !== "pending",
    badge: (
      <DashboardStatusBadge
        label={item.badge}
        tone={toneForStep(item.status)}
      />
    ),
  }));

  return (
    <DashboardTimeline
      title={title}
      description={description}
      items={timelineItems}
    />
  );
}
