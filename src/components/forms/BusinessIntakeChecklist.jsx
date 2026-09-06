import React from "react";

export default function BusinessIntakeChecklist({ items }) {
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <article
          key={item}
          className="rounded-[1.2rem] border border-stone-300/50 bg-paper/80 p-4"
        >
          <p className="font-body text-sm leading-6 text-ink">{item}</p>
        </article>
      ))}
    </div>
  );
}
