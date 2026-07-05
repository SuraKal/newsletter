import React from "react";
import { Link } from "react-router-dom";
import { Building2, Users, BarChart3, FileText } from "lucide-react";
import { IMAGES } from "@/lib/nequdem-data";

export default function BusinessSection() {
  return (
    <section className="nq-container py-16">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="order-2 lg:order-1 overflow-hidden rounded-2xl">
          <img
            src={IMAGES.businessSection}
            alt="Business subscription"
            className="w-full h-72 md:h-96 object-cover"
          />
        </div>
        <div className="order-1 lg:order-2">
          <span className="nq-category-label">For Organizations</span>
          <h2 className="nq-headline text-2xl md:text-4xl mt-3">
            The Nequdem Business Ledger
          </h2>
          <p className="nq-deck mt-4 text-base leading-relaxed">
            Equip your organization with the intelligence it needs. Nequdem
            Business offers bulk subscriptions, consolidated delivery, and a
            dedicated management dashboard designed for enterprises that value
            informed decision-making.
          </p>
          <div className="space-y-4 mt-8">
            {[
              {
                icon: Building2,
                text: "Bulk newspaper orders with volume pricing",
              },
              { icon: Users, text: "Manage up to 500 team members" },
              { icon: BarChart3, text: "Company-wide reading analytics" },
              { icon: FileText, text: "Consolidated billing and invoicing" },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3">
                <Icon className="w-5 h-5 text-heritage flex-shrink-0" />
                <span className="font-sans text-sm text-ink/80">{text}</span>
              </div>
            ))}
          </div>
          <Link
            to="/business"
            className="nq-btn-primary text-xs mt-8 inline-block"
          >
            Learn More
          </Link>
        </div>
      </div>
    </section>
  );
}
