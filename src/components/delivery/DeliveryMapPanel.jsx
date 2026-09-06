import React from "react";
import { DashboardPanel } from "@/components/dashboard/DashboardPrimitives";

export default function DeliveryMapPanel({
  title,
  description = null,
  imageSrc,
  imageAlt,
  caption = null,
  tags = [],
}) {
  return (
    <DashboardPanel title={title} description={description} className="h-full">
      <div className="overflow-hidden rounded-[1.2rem] border border-stone-200/80 bg-stone-50">
        <img
          src={imageSrc}
          alt={imageAlt}
          className="h-[260px] w-full object-cover"
        />
      </div>
      {tags.length ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="dashboard-filter-pill inline-flex items-center px-3 py-2 font-sans text-xs font-medium"
            >
              {tag}
            </span>
          ))}
        </div>
      ) : null}
      <p className="mt-4 font-sans text-xs leading-5 text-stone-500">
        {caption}
      </p>
    </DashboardPanel>
  );
}
