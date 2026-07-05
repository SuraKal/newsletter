import React from "react";

export default function SectionHeader({ title, subtitle }) {
  return (
    <div className="mb-8">
      <div className="nq-hairline mb-4" />
      <h2 className="nq-section-title">{title}</h2>
      {subtitle && <p className="nq-deck mt-1">{subtitle}</p>}
    </div>
  );
}
