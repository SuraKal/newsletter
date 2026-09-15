import React from "react";

export default function HeritageOrnament({ className = "" }) {
  return (
    <div
      aria-hidden="true"
      className={`heritage-ornament ${className}`.trim()}
    />
  );
}
