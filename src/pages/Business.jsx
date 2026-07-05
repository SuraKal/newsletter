import React from "react";
import PageWrapper from "@/components/nequdem/PageWrapper";
import { IMAGES } from "@/lib/nequdem-data";
import {
  Building2,
  Users,
  BarChart3,
  FileText,
  Truck,
  Shield,
  Check,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function Business() {
  return (
    <PageWrapper>
      {/* Hero */}
      <section className="nq-container py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="nq-category-label">Business Solutions</span>
            <h1 className="nq-headline text-3xl md:text-5xl mt-4">
              Empower Your Organization With Premium Intelligence
            </h1>
            <p className="nq-deck mt-4 text-base leading-relaxed">
              Nequdem Business provides organizations with comprehensive access
              to our journalism, consolidated delivery management, and
              enterprise-grade tools for teams of any size.
            </p>
            <div className="flex flex-wrap gap-3 mt-8">
              <button className="nq-btn-primary text-xs">Request a Demo</button>
              <Link to="/subscriptions" className="nq-btn-outline text-xs">
                View Plans
              </Link>
            </div>
          </div>
          <div className="overflow-hidden">
            <img
              src={IMAGES.businessSection}
              alt="Business solutions"
              className="w-full h-80 object-cover"
            />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="nq-vellum py-16">
        <div className="nq-container">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="nq-headline text-2xl md:text-4xl">
              Everything Your Team Needs
            </h2>
            <p className="nq-deck mt-3">
              From bulk subscriptions to consolidated invoicing, we have built
              the tools that organizations demand.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Building2,
                title: "Bulk Subscriptions",
                desc: "Order newspapers in volume with significant discounts. Manage distribution across multiple offices and locations.",
              },
              {
                icon: Users,
                title: "Team Management",
                desc: "Add and remove team members, assign reading permissions, and monitor engagement across your organization.",
              },
              {
                icon: Truck,
                title: "Consolidated Delivery",
                desc: "Single delivery point or distributed shipping — track every package from press to each office.",
              },
              {
                icon: BarChart3,
                title: "Reading Analytics",
                desc: "Understand which topics your team engages with most. Generate reports for leadership briefings.",
              },
              {
                icon: FileText,
                title: "Consolidated Billing",
                desc: "One invoice, one payment. Simplify accounting with our enterprise billing system.",
              },
              {
                icon: Shield,
                title: "Dedicated Support",
                desc: "Your assigned account manager ensures seamless onboarding, training, and ongoing support.",
              },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="p-8 nq-parchment border border-rule">
                <Icon className="w-8 h-8 text-heritage mb-4" />
                <h3 className="font-display text-lg font-bold text-ink">
                  {title}
                </h3>
                <p className="font-sans text-sm text-muted-foreground mt-2">
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="nq-container py-16">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="nq-headline text-2xl md:text-4xl">Volume Pricing</h2>
          <p className="nq-deck mt-3">
            The more your organization subscribes, the more you save.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {[
            {
              seats: "10–25",
              price: "$69",
              perSeat: "per seat/month",
              features: [
                "Digital + Print access",
                "Team dashboard",
                "Email support",
              ],
            },
            {
              seats: "26–100",
              price: "$54",
              perSeat: "per seat/month",
              featured: true,
              features: [
                "Everything in 10–25",
                "Dedicated account manager",
                "Custom delivery schedule",
                "Reading analytics",
              ],
            },
            {
              seats: "100+",
              price: "Custom",
              perSeat: "contact us",
              features: [
                "Everything in 26–100",
                "API access",
                "White-label options",
                "Priority support",
                "Custom integrations",
              ],
            },
          ].map((tier) => (
            <div
              key={tier.seats}
              className={`p-8 border ${tier.featured ? "nq-vellum border-heritage shadow-md" : "nq-parchment border-rule"}`}
            >
              <h3 className="font-sans text-xs uppercase tracking-widest font-bold text-heritage">
                {tier.seats} seats
              </h3>
              <div className="mt-3">
                <span className="font-display text-4xl font-bold text-ink">
                  {tier.price}
                </span>
                <span className="font-sans text-sm text-muted-foreground ml-1">
                  {tier.perSeat}
                </span>
              </div>
              <ul className="mt-6 space-y-2">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-heritage flex-shrink-0 mt-0.5" />
                    <span className="font-sans text-sm text-ink/80">{f}</span>
                  </li>
                ))}
              </ul>
              <button
                className={`w-full text-center mt-8 text-xs py-3 ${tier.featured ? "nq-btn-primary" : "nq-btn-outline"}`}
              >
                Get Started
              </button>
            </div>
          ))}
        </div>
      </section>
    </PageWrapper>
  );
}
