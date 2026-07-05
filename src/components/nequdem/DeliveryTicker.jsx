import React from "react";
import { TICKER_ITEMS } from "@/lib/nequdem-data";
import { Truck } from "lucide-react";

export default function DeliveryTicker() {
  const items = [...TICKER_ITEMS, ...TICKER_ITEMS];

  return (
    <div className="bg-heritage text-parchment overflow-hidden">
      <div className="flex items-center animate-ticker-scroll whitespace-nowrap py-1.5">
        {items.map((item, i) => (
          <span
            key={i}
            className="flex items-center mx-6 text-xs font-sans tracking-wider uppercase"
          >
            <Truck className="w-3 h-3 mr-2 opacity-70" />
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
