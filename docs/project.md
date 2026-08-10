**PROJECT PROPOSAL**

**Subscription Newspaper Publishing & Delivery Platform**

A multi-sector digital publishing platform with physical newspaper subscriptions, fleet-integrated delivery tracking, and bulk ordering for business clients across Belgium and Germany.

**Prepared for:**

\[Client / Company Name\]

**Prepared by:**

Surafel Kal - Full-Stack Software Developer

**Date:**

June 19, 2026

# 1\. Executive Summary

This proposal outlines the design and development of a digital platform that allows a publishing company to produce sector-specific news content and distribute it both digitally and as a physical, courier-delivered newspaper. The platform supports individual subscribers and business (bulk) accounts, integrates with the company's existing truck-delivery and mapping system for shipment tracking, and gives both customers and administrators dedicated dashboards to manage content, subscriptions, and deliveries.

The platform is scoped for operation in Belgium and Germany, with attention to the data protection and payment compliance requirements that come with serving customers in the European Union.

# 2\. Project Overview

The client publishes news content across multiple sectors - sport, politics, and events, among others - and wants to modernize how that content is created, published, and delivered. Today's requirement combines three distinct systems into one cohesive platform:

- A content management system that lets editors build sector-specific stories with text, images, and dates, and publish them immediately or on a schedule.
- A subscription and billing system that separates how customers are charged (monthly or yearly) from how often they receive a physical newspaper (every two weeks).
- A logistics integration layer that connects to the company's existing truck-delivery and mapping system so customers and admins can track shipments in real time.

# 3\. Objectives

1. Give editorial staff a fast, structured way to publish content by sector, with support for scheduled publishing.
2. Allow individual and business customers to subscribe, pay, and manage their account from a self-service dashboard.
3. Enforce the content access rule: full access for active subscribers, a one-month delayed view for non-subscribers.
4. Track and surface physical newspaper deliveries by integrating with the client's existing fleet/map system.
5. Support differentiated pricing for bulk (business) orders versus individual orders.
6. Provide an administrative dashboard for managing content, subscribers, companies, and shipments.
7. Operate compliantly across Belgium and Germany, including data protection and payment handling.

# 4\. Scope of Work

## 4.1 Content Publishing System

Editors will work from a set of sector-specific templates rather than a single generic article form, since a sports story and an events listing don't need the same fields.

- Pre-built templates for sectors such as Sport, Politics, and Events, each with fields suited to that content type (e.g. an event date and location field for Events).
- Rich content editor supporting body text, embedded images, and associated dates.
- Immediate publish, or scheduled publish for a future date and time - the system automatically makes the content live and triggers any associated print run when the scheduled time arrives.
- A draft state so content can be prepared ahead of its publish date.

## 4.2 Subscription Management

Billing frequency and delivery frequency are treated as two separate concepts, since a subscriber's payment cycle does not need to match how often a physical paper arrives.

- Subscription plans billed monthly or yearly.
- A fixed two-week physical delivery cadence that applies to all active subscribers regardless of whether they are billed monthly or yearly.
- Subscription status (active, paused, cancelled) drives whether a delivery is scheduled for a given cycle.
- Non-subscribers can still browse published content, but only once it is at least one month old; recent content is reserved for active subscribers.

## 4.3 Delivery & Shipment Tracking

Rather than building a new logistics system, the platform integrates with the truck-delivery and mapping system the client already operates.

- Integration with the existing fleet/map system to retrieve live shipment location and status.
- Each subscriber's delivery is linked to a shipment record so its status can be displayed in their dashboard.
- Admins can view delivery status across all active shipments, not just one at a time.
- The exact integration method (API, webhook, or shared data feed) will be confirmed once the client's logistics provider documentation is available - see Section 9.

## 4.4 Payment Processing

- Supported payment methods: PayPal, Mastercard, and Visa.
- Recurring billing for monthly and yearly subscription plans.
- One-time invoicing for bulk/business orders, with volume-based pricing tiers.
- Card data is handled through a PCI-compliant payment processor (e.g. Stripe, Adyen, or PayPal's own vaulting) rather than stored directly on the platform's own servers - see Section 6 for why this matters.

## 4.5 User Dashboard

Both individual and business customers get a self-service dashboard covering:

- Payment history.
- Subscription history and current plan details.
- Delivery status and estimated arrival for their next newspaper, sourced from the shipment tracking integration.
- Personal information management - name, address, and contact details.
- For business accounts: bulk order history and applicable volume pricing.

## 4.6 Admin Dashboard

- Publish or schedule content across all sector templates.
- Manage individual and business customer accounts.
- Oversee active subscriptions, renewals, and cancellations.
- Monitor shipment status across all outbound deliveries.
- Manage bulk-order pricing tiers for business accounts.

## 4.7 Customer Onboarding & Account Data

During sign-up, the platform captures the information needed to ship and bill correctly:

- Name and contact details.
- Delivery address, used to determine shipment routing.
- Payment details, captured and stored via the payment processor's secure vault rather than on the platform's own database (see Section 6).
- Account type (individual or business), which determines pricing tier and dashboard view.

# 5\. Individual vs. Business Accounts

The platform distinguishes between two customer types with different pricing and ordering behavior:

| **Aspect**        | **Individual Subscriber**  | **Business Account**            |
| ----------------- | -------------------------- | ------------------------------- |
| Order volume      | Single copy per delivery   | Bulk copies per delivery        |
| Pricing           | Standard subscription rate | Discounted volume-based rate    |
| Billing cycle     | Monthly or yearly          | Negotiated / contract-based     |
| Shipment tracking | Single shipment view       | Consolidated bulk shipment view |

# 6\. Compliance & Security

Two compliance areas are central to this platform, given that payment details and personal data are both being collected from EU residents.

## 6.1 Payment Data (PCI-DSS)

Storing raw card numbers directly on the platform's own servers brings a significant compliance burden (full PCI-DSS certification). The recommended approach is to never store card numbers in the platform's database at all - instead, card details are captured and stored by a PCI-compliant processor (such as Stripe, Adyen, or PayPal's vault), and the platform only stores a reference token. This keeps the customer experience identical while removing most of the compliance burden from the platform itself.

## 6.2 Personal Data (GDPR)

Because the platform serves customers in Belgium and Germany, both EU member states, it falls under GDPR. This affects how the platform handles name, address, and account data:

- Clear consent at sign-up for how personal data will be used, including sharing delivery addresses with the logistics/courier system.
- A defined data retention and deletion policy.
- Customer ability to access, export, or request deletion of their own data from the dashboard.

# 7\. Operating in Belgium and Germany

Both countries use the euro, which simplifies pricing and billing. Other considerations for multi-country operation include:

- Language: Belgium has French, Dutch, and German-speaking populations; Germany is German-speaking. Content and platform UI may need multi-language support.
- Country-specific tax handling (VAT) for invoicing business accounts.
- Delivery routing that respects each country's regional logistics network, as provided by the client's existing fleet system.

# 8\. Technical Approach

At a high level, the platform is structured around four cooperating areas:

- Content service - manages articles, sector templates, and the publish/schedule workflow.
- Subscription & billing service - manages plans, billing cycles, and payment processor integration.
- Delivery integration layer - a connector to the client's existing truck/map system, translating their shipment data into a format the dashboards can display.
- Customer & admin dashboards - the user-facing applications for subscribers, business accounts, and platform administrators.

The exact technology stack will be confirmed in the technical design phase, but the architecture is intentionally modular so the delivery integration (the one component dependent on a third party's existing system) can be developed and tested independently of the content and billing components.

# 9\. Assumptions & Items Requiring Confirmation

The following working assumptions are reflected in this proposal. They are reasonable defaults, but should be confirmed with the client before detailed design begins:

**Mid-cycle sign-ups:** a new subscriber is added to the next scheduled regional delivery run, rather than starting an individual two-week countdown from their sign-up date. This keeps delivery routing efficient for the truck fleet. This can be revisited if per-subscriber cycles are preferred.

**Cancellations:** an active subscription, and its associated deliveries, remains valid through the end of the period already paid for. Cancellation takes effect at the next renewal date rather than immediately.

**Logistics integration access:** this proposal assumes the client's existing truck-delivery and mapping system can expose shipment data through an API, webhook, or shared data feed. The exact integration method will be confirmed once that system's documentation is available.

**Bulk pricing structure:** specific volume discount tiers for business accounts are not yet defined and will be confirmed with the client separately.

# 10\. Proposed Project Phases

1. Discovery & Technical Design - confirm logistics integration method, finalize data model, and validate compliance approach.
2. Core Platform Build - content publishing system, subscription & billing, customer and admin dashboards.
3. Delivery Integration - connect to the client's existing fleet/map system and surface shipment tracking in both dashboards.
4. Testing & Compliance Review - functional testing, GDPR/PCI review, and payment flow validation.
5. Launch - phased rollout, starting with one country before expanding to the second.

# 11\. Deliverables

- A fully functional publishing platform with sector-based content templates and scheduled publishing.
- A subscription and billing system supporting monthly and yearly plans with two-week delivery cadence.
- Integration with the client's existing delivery tracking and mapping system.
- Customer dashboard (web) for individuals and business accounts.
- Administrative dashboard for content, subscriber, and shipment management.
- Documentation covering system architecture, data model, and the logistics integration.

# 12\. Next Steps

The recommended next step is a short technical discovery session focused specifically on the client's existing truck-delivery and mapping system - confirming what data it can expose and how - since that integration is the main external dependency for the project timeline. In parallel, we can finalize the business-account pricing tiers and confirm the assumptions listed in Section 9.