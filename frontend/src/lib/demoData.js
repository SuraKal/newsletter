import { IMAGES } from "@/lib/constants";
import { appParams } from "@/lib/app-params";

export const heroArticle = {
  id: "hero-1",
  image: IMAGES.hero,
  category: "Politics",
  date: "August 10, 2026",
  headline:
    "Election Calendar, Freight Capacity, and Weekend Fixtures Drive Today's Cross-Sector Edition",
  summary:
    "Today's front page blends public affairs, logistics, business, and sport into one subscriber edition designed for readers who need both fast updates and deeper print context.",
  author: "Nael Desk",
  readTime: "7 min read",
};

export const sidebarArticles = [
  {
    id: "side-1",
    image: IMAGES.politics,
    category: "Politics",
    date: "August 10, 2026",
    headline:
      "Regional Editors Prepare Tonight's Politics Brief Ahead of Council and Parliament Sessions",
    summary:
      "Subscriber editions package the decisions shaping transport, public spending, and local business confidence.",
  },
  {
    id: "side-2",
    image: IMAGES.business,
    category: "Business",
    date: "August 9, 2026",
    headline:
      "Business Desk Tracks Port Throughput and Retail Demand Across Belgium and Germany",
    summary:
      "Operational reporting now shares the same platform as print planning and delivery tracking.",
  },
  {
    id: "side-3",
    image: null,
    category: "Events",
    date: "August 9, 2026",
    headline:
      "Events Editors Schedule Weekend Listings with Venue Dates, Locations, and Sponsor Notes",
    summary:
      "Sector-specific publishing templates keep listings structured before they go live or to print.",
  },
  {
    id: "side-4",
    image: null,
    category: "Sports",
    date: "August 8, 2026",
    headline:
      "Sports Coverage Moves From Match Recap to Morning Print Summary Without Leaving the Same Workflow",
    summary:
      "Live digital coverage and the next physical edition now tell one continuous story.",
  },
];

export const rightColumnArticle = {
  id: "right-1",
  image: IMAGES.economy,
  category: "Reader Guide",
  date: "August 10, 2026",
  headline: "Why Recent Reporting Is Reserved for Subscribers and Opens Publicly 30 Days Later",
  summary:
    "The platform protects the value of fresh reporting for active subscribers while still opening a delayed archive for public readers one month later.",
  author: "Editorial Operations",
};

export const latestNews = [
  {
    id: "ln-1",
    image: IMAGES.politics,
    category: "Politics",
    date: "August 10, 2026",
    headline:
      "City and federal policy desks align today's morning briefing around transport, regulation, and labor votes",
    summary:
      "The politics desk publishes now for subscribers and schedules the same reporting for public archive access on September 10, 2026.",
    author: "James Harrington",
    accessLabel: "Subscribers now",
    publicAccessDate: "September 10, 2026",
    sector: "Policy desk",
  },
  {
    id: "ln-2",
    image: IMAGES.sports,
    category: "Sports",
    date: "August 9, 2026",
    headline:
      "Weekend fixtures move from live alerts to the next print run with match tables and analysis intact",
    summary:
      "Subscriber coverage is already live, while public readers unlock this edition on September 9, 2026.",
    author: "Maria Santos",
    accessLabel: "Archive opens September 9, 2026",
    publicAccessDate: "September 9, 2026",
    sector: "Sport desk",
  },
  {
    id: "ln-3",
    image: IMAGES.business,
    category: "Business",
    date: "August 9, 2026",
    headline:
      "Freight, pricing, and retail coverage now feeds both reader editions and business account ordering decisions",
    summary:
      "The same newsroom data that informs articles also supports bulk-order planning and route visibility.",
    author: "Thomas Chen",
    accessLabel: "Subscriber release",
    publicAccessDate: "September 9, 2026",
    sector: "Business desk",
  },
  {
    id: "ln-4",
    image: IMAGES.events,
    category: "Events",
    date: "August 8, 2026",
    headline:
      "Events listings publish with venue fields, dates, and regional logistics notes for the next physical drop",
    summary:
      "Structured event publishing keeps digital readers and print subscribers aligned before the next delivery cycle.",
    author: "Dr. Emily Rossini",
    accessLabel: "Public September 8, 2026",
    publicAccessDate: "September 8, 2026",
    sector: "Events desk",
  },
];

export const homepageHeroSlides = [
  {
    id: "promise-1",
    image: IMAGES.hero,
    category: "Subscription Newspaper Platform",
    headline: "Sector reporting, subscriber access, and print delivery built into one newsroom.",
    summary:
      "Read fresh politics, sport, business, and events coverage online right away, then receive the same reporting as a physical edition on the next two-week delivery cycle.",
    cta: "Start a subscription",
    href: "/subscriptions",
  },
  {
    id: "promise-2",
    image: IMAGES.business,
    category: "Business Accounts",
    headline: "Bulk orders, consolidated billing, and company-level delivery visibility for teams.",
    summary:
      "Organizations can order newspapers in volume, manage locations, and follow shipments through a dedicated business workspace instead of patching together manual invoicing.",
    cta: "Explore business plans",
    href: "/business",
  },
  {
    id: "promise-3",
    image: IMAGES.delivery,
    category: "Fleet-Linked Tracking",
    headline: "Every print run can be tracked from press time to doorstep using the client's existing route system.",
    summary:
      "Subscribers and operations teams share one delivery truth, with live shipment states feeding reader, business, and admin experiences.",
    cta: "See delivery tracking",
    href: "/delivery",
  },
];

export const topSliderSlides = [
  {
    id: "top-1",
    image: IMAGES.politics,
    category: "Breaking News",
    headline: "Federal Council Votes on Landmark Infrastructure Bill Affecting National Transport Grid",
    summary:
      "Lawmakers convene for a decisive session as the proposed legislation promises to reshape freight corridors and public transit funding across Belgium and Germany.",
    cta: "Read full coverage",
    href: "/news/politics-infrastructure-bill",
  },
  {
    id: "top-2",
    image: IMAGES.sports,
    category: "Weekend Preview",
    headline: "Championship Fixtures Set as Clubs Finalize Lineups for Season Opener",
    summary:
      "Pre-season conclusions and transfer deadlines collide this weekend with six marquee matches headlining the opening round of competitive play.",
    cta: "See match schedule",
    href: "/news/sports-weekend-preview",
  },
  {
    id: "top-3",
    image: IMAGES.economy,
    category: "Market Report",
    headline: "Eurozone Inflation Data Points to Shift in Central Bank Rate Strategy",
    summary:
      "New consumer price indices released this morning suggest policymakers may accelerate easing timelines as retail demand softens in core economies.",
    cta: "View market analysis",
    href: "/news/eurozone-inflation-report",
  },
  {
    id: "top-4",
    image: IMAGES.culture,
    category: "Culture & Events",
    headline: "Summer Festival Season Peaks with Record Attendance Across Major European Cities",
    summary:
      "From Brussels to Berlin, cultural institutions report surge in visitors as outdoor programming and live events draw pre-pandemic crowds.",
    cta: "Explore events guide",
    href: "/news/summer-festival-coverage",
  },
];

export const categoryArticles = {
  news: [
    {
      id: "news-1",
      image: IMAGES.politics,
      category: "News",
      date: "July 4, 2026",
      headline: "City Council Approves New Waterline and Road Repair Program",
      summary:
        "The $18 million package targets aging mains, flood-prone intersections, and long-delayed neighborhood resurfacing work.",
      author: "Nadia Okello",
      readTime: "5 min read",
      body: [
        "The council vote came after weeks of public hearings in which residents described recurring water interruptions and dangerous road conditions across several districts.",
        "Officials said the first phase will focus on the oldest utility corridors, with crews expected to begin work before the end of the month.",
        "Community leaders welcomed the measure but urged the city to publish a transparent construction schedule so residents can plan around traffic disruptions.",
      ],
    },
  ],
  community: [
    {
      id: "community-1",
      image: IMAGES.culture,
      category: "Community",
      date: "July 3, 2026",
      headline: "Local Couple Celebrates 50 Years of Marriage Surrounded by Family",
      summary:
        "What began at a neighborhood church picnic in the late 1970s has grown into a family story spanning four generations.",
      author: "Esther Mumo",
      readTime: "4 min read",
      body: [
        "The celebration included tributes from children, grandchildren, and longtime neighbors who filled the hall with laughter and photographs.",
        "Friends described the couple as steady anchors in the community, known for mentoring young people and hosting holiday meals for those far from home.",
        "The family said the anniversary was not only a private milestone, but a reminder of the bonds that make neighborhoods stronger.",
      ],
    },
  ],
  business: [
    {
      id: "business-1",
      image: IMAGES.business,
      category: "Business",
      date: "July 2, 2026",
      headline: "Family-Owned Logistics Firm Expands After Securing Regional Contract",
      summary:
        "The company will add vehicles, hire drivers, and open a second warehouse to handle growing distribution demand.",
      author: "Martin Owino",
      readTime: "6 min read",
      body: [
        "The contract marks a turning point for the thirty-year-old firm, which started with a single delivery truck and two employees.",
        "Executives said the expansion will create new jobs in dispatch, warehousing, and route management over the next quarter.",
        "Industry analysts noted that small logistics providers are increasingly benefiting from businesses seeking more flexible regional distribution partners.",
      ],
    },
    {
      id: "biz-1",
      image: IMAGES.business,
      category: "Business",
      date: "July 2, 2026",
      headline:
        "Sustainable Finance Reaches Record Volumes as ESG Standards Mature",
      summary:
        "Green bonds and sustainability-linked loans surpass $5 trillion globally.",
    },
  ],
  technology: [
    {
      id: "tech-1",
      image: IMAGES.technology,
      category: "Technology",
      date: "July 3, 2026",
      headline:
        "Open-Source AI Models Challenge Corporate Dominance in Machine Learning",
      summary:
        "Community-driven development produces models rivaling those from major tech companies.",
    },
  ],
  culture: [
    {
      id: "cul-1",
      image: IMAGES.culture,
      category: "Culture",
      date: "July 2, 2026",
      headline:
        "International Film Festival Showcases New Wave of Documentary Filmmaking",
      summary:
        "Critics praise the emergence of innovative storytelling techniques.",
    },
  ],
  events: [
    {
      id: "evt-1",
      image: IMAGES.events,
      category: "Events",
      date: "July 1, 2026",
      headline:
        "World Economic Forum Announces Agenda for Annual Meeting in Davos",
      summary:
        "Focus areas include artificial intelligence governance and climate finance.",
    },
  ],
};

export const featuredStory = {
  id: "feat-1",
  image: IMAGES.featured,
  category: "Feature",
  date: "July 4, 2026",
  headline:
    "The Vanishing Art of the Morning Paper: How a New Generation Is Rediscovering Print Journalism",
  summary:
    "In an era dominated by digital feeds and algorithmic news delivery, a surprising counter-movement is emerging among younger readers. From artisanal newsprint cafés in Brooklyn to subscription clubs in London's Shoreditch, millennials and Gen Z readers are embracing the tactile experience of holding a newspaper. This long-form investigation explores what draws them to ink and paper — and what it means for the future of journalism.",
  author: "Eleanor Vance",
  readTime: "12 min read",
};

export const testimonials = [
  {
    name: "Margaret Ashworth",
    role: "University Professor, London",
    quote:
      "ንቐደም has become my indispensable morning companion. The depth of analysis rivals the finest broadsheets I've read in three decades of academia.",
  },
  {
    name: "David Chen",
    role: "Investment Director, Singapore",
    quote:
      "The business coverage is exceptional — balanced, insightful, and consistently ahead of the curve. Our entire team relies on ንቐደም for market intelligence.",
  },
  {
    name: "Isabel Moreno",
    role: "Journalist & Author, Madrid",
    quote:
      "As a fellow journalist, I deeply respect ንቐደም's commitment to editorial independence. Their investigative reporting sets the standard for our industry.",
  },
];

export const editorials = [
  {
    id: "ed-1",
    image: IMAGES.culture,
    category: "Editorial",
    date: "July 4, 2026",
    headline: "Why the Future of Democracy Depends on Independent Press",
    summary:
      "Our editor-in-chief reflects on the role of journalism in protecting democratic institutions.",
    author: "Katherine Price",
  },
  {
    id: "ed-2",
    image: IMAGES.economy,
    category: "Analysis",
    date: "July 3, 2026",
    headline:
      "The Hidden Cost of Cheap Energy: A Reckoning Decades in the Making",
    summary:
      "An investigation into how energy subsidies have shaped — and distorted — global markets.",
    author: "Robert Hale",
  },
  {
    id: "ed-3",
    image: IMAGES.events,
    category: "Opinion",
    date: "July 2, 2026",
    headline:
      "Artificial Intelligence in the Newsroom: Promise, Peril, and the Path Forward",
    summary:
      "How emerging technology is transforming — but not replacing — the craft of journalism.",
    author: "Dr. Amara Osei",
  },
];

export const subscriptionPlans = [
  {
    id: "digital",
    name: "Digital",
    price: "9.99",
    monthlyPrice: 9.99,
    yearlyPrice: 119.88,
    period: "/month",
    description: "Immediate digital access for individual readers",
    features: [
      "Subscriber-only access to recent reporting",
      "Daily digital edition across all desks",
      "Archive access once public windows open",
      "Mobile and tablet reading",
      "Breaking news and newsletter updates",
      "Monthly billing with no print delivery",
    ],
    highlighted: false,
    audience: "Individual readers",
    deliveryNote: "Digital only",
    paymentNote: "PayPal, Visa, or Mastercard",
  },
  {
    id: "print-digital",
    name: "Print + Digital",
    price: "24.99",
    monthlyPrice: 24.99,
    yearlyPrice: 299.88,
    period: "/month",
    description: "The complete ንቐደም experience",
    features: [
      "Everything in Digital",
      "Physical newspaper every two weeks",
      "Real-time delivery tracking",
      "Subscriber-only recent articles",
      "Premium long-form and weekend editions",
      "Address and delivery management",
      "Monthly or yearly billing options",
    ],
    highlighted: true,
    audience: "Households and dedicated readers",
    deliveryNote: "Biweekly print delivery",
    paymentNote: "PayPal, Visa, or Mastercard",
  },
  {
    id: "business",
    name: "Business",
    price: "Custom",
    pricePrefix: "",
    period: "",
    yearlyPrice: 0,
    description: "Volume-priced newspaper access for teams and organizations",
    features: [
      "Bulk print orders by location or team",
      "Consolidated invoicing and contract billing",
      "Company dashboard with shipment visibility",
      "Multi-location delivery coordination",
      "Volume-sensitive pricing",
      "Dedicated onboarding and account support",
    ],
    highlighted: false,
    audience: "Companies and institutions",
    deliveryNote: "Bulk delivery scheduling",
    paymentNote: "Invoice and contract billing",
  },
];

export const readerCheckoutPlans = subscriptionPlans.filter(
  (plan) => plan.id !== "business",
);

export const readerCheckoutSteps = [
  {
    id: "plan",
    label: "Plan",
    detail: "Choose digital or print access and confirm the billing cycle.",
  },
  {
    id: "delivery",
    label: "Delivery",
    detail: "Capture the address and contact details needed for routing.",
  },
  {
    id: "payment",
    label: "Payment",
    detail: "Select a supported payment method and confirm recurring billing.",
  },
  {
    id: "confirm",
    label: "Confirm",
    detail: "Review the quote and complete the mocked checkout return.",
  },
];

export const readerPaymentMethods = [
  {
    id: "paypal",
    label: "PayPal",
    detail: "Redirect-style checkout for wallet approval and billing consent.",
  },
  {
    id: "visa",
    label: "Visa",
    detail: "Card payment captured through a PCI-compliant processor reference.",
  },
  {
    id: "mastercard",
    label: "Mastercard",
    detail: "Card payment captured through a PCI-compliant processor reference.",
  },
];

export const readerDashboardFallbackOverview = {
  subscriptionStatus: "Trial-ready workspace",
  planName: "Print + Digital",
  nextBillingDate: "September 11, 2026",
  nextDeliveryDate: "August 25, 2026",
  accessState: "Subscriber archive unlocked",
  paymentMethod: "PayPal",
  deliveryMode: "Biweekly print + digital",
  deliveryWindow: "Next delivery window opens August 25, 2026",
};

export const readerDashboardReadingBars = [
  { label: "Mon", value: 32, tone: "default" },
  { label: "Tue", value: 44, tone: "accent" },
  { label: "Wed", value: 37, tone: "default" },
  { label: "Thu", value: 52, tone: "accent" },
  { label: "Fri", value: 41, tone: "default" },
  { label: "Sat", value: 48, tone: "accent" },
  { label: "Sun", value: 29, tone: "default" },
];

export const readerDashboardActivityRows = [
  {
    id: "reader-overview-1",
    item: "Renewal notice issued",
    status: "Upcoming",
    tone: "warning",
    date: "August 18, 2026",
  },
  {
    id: "reader-overview-2",
    item: "Delivery route assigned",
    status: "On track",
    tone: "success",
    date: "August 12, 2026",
  },
  {
    id: "reader-overview-3",
    item: "Saved article collection synced",
    status: "Updated",
    tone: "info",
    date: "August 10, 2026",
  },
  {
    id: "reader-overview-4",
    item: "Archive access reminder",
    status: "Ready",
    tone: "neutral",
    date: "August 9, 2026",
  },
];

export const readerDashboardDeliveryTimeline = [
  {
    label: "Editorial lock",
    description:
      "The subscriber edition closes and the print batch is prepared for the next eligible route.",
    completed: true,
    badge: "Completed",
  },
  {
    label: "Packing and route match",
    description:
      "Copies are grouped by region and matched to your active delivery address before dispatch.",
    completed: true,
    badge: "Prepared",
  },
  {
    label: "Fleet dispatch",
    description:
      "Shipment status begins to move through the route health workflow the reader delivery module will expose next.",
    completed: false,
    badge: "Pending",
  },
  {
    label: "Doorstep arrival",
    description:
      "Final ETA and drop confirmation will appear once the shared logistics components are connected.",
    completed: false,
    badge: "Scheduled",
  },
];

export const readerDashboardReadingList = [
  {
    id: "reader-reading-1",
    title: "Logistics reform debate enters committee review",
    detail:
      "Saved from Politics. Still inside the subscriber-first window and available in full.",
    route: "/article/news-1",
    status: "Subscriber access",
    tone: "success",
  },
  {
    id: "reader-reading-2",
    title: "Regional rail upgrade expands delivery confidence",
    detail:
      "Marked to continue later. Useful context for the next print cycle and route coverage.",
    route: "/article/business-1",
    status: "Continue reading",
    tone: "info",
  },
  {
    id: "reader-reading-3",
    title: "Weekend analysis on media habits",
    detail:
      "Moved into the delayed public archive soon, but still featured in your recent reading queue.",
    route: "/article/feat-1",
    status: "Archive soon",
    tone: "warning",
  },
];

export const readerDashboardQuickActions = [
  {
    label: "Open deliveries",
    detail: "Check shipment timing and upcoming print status.",
    route: "/dashboard/deliveries",
  },
  {
    label: "Manage billing",
    detail: "Review renewal timing and plan details.",
    route: "/dashboard/billing",
  },
  {
    label: "Reading history",
    detail: "Continue saved stories and recent reads.",
    route: "/dashboard/history",
  },
];

export const readerDeliveryCurrent = {
  edition: "August 25, 2026 Edition",
  trackingId: "NQ-20260825",
  status: "Route preparing",
  tone: "info",
  eta: "August 25, 2026 · 8:00-9:00 AM",
  destination: "Brussels North route cluster",
  note:
    "The next print cycle is scheduled and the address has already been matched to an active regional route.",
};

export const readerDeliveryTimeline = [
  {
    label: "Editorial lock",
    description:
      "The August 25 subscriber edition is closed and queued for print preparation.",
    badge: "Completed",
    status: "completed",
    icon: "Clock",
  },
  {
    label: "Print and packaging",
    description:
      "Copies are grouped by route and verified against active subscriber addresses.",
    badge: "In queue",
    status: "active",
    icon: "Package",
  },
  {
    label: "Fleet dispatch",
    description:
      "Truck assignment and dispatch confirmation will appear here once the route is released.",
    badge: "Pending",
    status: "pending",
    icon: "Truck",
  },
  {
    label: "Doorstep confirmation",
    description:
      "ETA and final drop confirmation will update after dispatch begins.",
    badge: "Pending",
    status: "pending",
    icon: "MapPin",
  },
];

export const readerDeliveryHistoryRows = [
  {
    id: "delivery-history-1",
    edition: "August 11, 2026 Edition",
    trackingId: "NQ-20260811",
    status: "Delivered",
    tone: "success",
    date: "August 11, 2026 · 8:24 AM",
  },
  {
    id: "delivery-history-2",
    edition: "July 28, 2026 Edition",
    trackingId: "NQ-20260728",
    status: "Delivered",
    tone: "success",
    date: "July 28, 2026 · 8:11 AM",
  },
  {
    id: "delivery-history-3",
    edition: "July 14, 2026 Edition",
    trackingId: "NQ-20260714",
    status: "Delivered",
    tone: "success",
    date: "July 14, 2026 · 8:29 AM",
  },
  {
    id: "delivery-history-4",
    edition: "June 30, 2026 Edition",
    trackingId: "NQ-20260630",
    status: "Delivered",
    tone: "success",
    date: "June 30, 2026 · 8:18 AM",
  },
];

export const readerDeliveryKpis = [
  {
    label: "Cadence",
    value: "Every 2 weeks",
    detail: "Print timing stays fixed even when billing changes from monthly to yearly.",
    icon: "CalendarClock",
  },
  {
    label: "Last successful drop",
    value: "August 11, 2026",
    detail: "Most recent subscriber edition reached the saved delivery profile.",
    icon: "CheckCircle2",
    accent: true,
  },
  {
    label: "Current issue state",
    value: "No active exceptions",
    detail: "The next shipment is on track without reroute or support flags.",
    icon: "ShieldCheck",
  },
];

export const readerDeliveryIssueStates = [
  {
    id: "reader-delivery-issue-1",
    label: "Route health",
    summary: "The August 25 shipment is still moving without delay or reroute flags.",
    status: "Healthy",
    tone: "success",
    icon: "ShieldCheck",
    detail:
      "If the fleet integration reports a late dispatch or delivery exception later, this same panel can surface it without changing the route layout.",
  },
  {
    id: "reader-delivery-issue-2",
    label: "Address verification",
    summary: "The Brussels delivery profile is matched to the current regional cluster.",
    status: "Verified",
    tone: "info",
    icon: "MapPinned",
    detail:
      "Route grouping still depends on the saved address, so profile edits should happen before editorial lock when possible.",
  },
  {
    id: "reader-delivery-issue-3",
    label: "Support path",
    summary: "No support case is open for the latest subscriber edition.",
    status: "Standby",
    tone: "neutral",
    icon: "LifeBuoy",
    detail:
      "Missed-drop, damage, and doorstep confirmation issues can attach to this same shared component once real ticket states arrive.",
  },
];

export const businessShipmentKpis = [
  {
    label: "Active shipments",
    value: "4",
    detail: "Consolidated business runs can cover several sites without fragmenting the dashboard view.",
    icon: "Package",
  },
  {
    label: "Delivery points",
    value: "9",
    detail: "Current contract footprint across Brussels, Antwerp, Cologne, and Berlin receiving points.",
    icon: "CalendarClock",
    accent: true,
  },
  {
    label: "Issue state",
    value: "1 receiving note",
    detail: "Only one branch has a handling note ahead of the next consolidated drop.",
    icon: "ShieldCheck",
  },
];

export const businessShipmentRows = [
  {
    id: "business-shipment-1",
    shipmentId: "BIZ-20260811-A",
    label: "Atlas Hotels Belgium",
    route: "Belgium North cluster",
    scope: "3 sites / 180 copies",
    status: "In dispatch",
    tone: "info",
    eta: "August 11, 2026 · 8:10 AM",
  },
  {
    id: "business-shipment-2",
    shipmentId: "BIZ-20260811-B",
    label: "Meridian Trade Offices",
    route: "Brussels central corridor",
    scope: "2 sites / 95 copies",
    status: "Delivered",
    tone: "success",
    eta: "August 11, 2026 · 8:02 AM",
  },
  {
    id: "business-shipment-3",
    shipmentId: "BIZ-20260825-A",
    label: "Rhine Partner Lounges",
    route: "Germany West corridor",
    scope: "2 sites / 140 copies",
    status: "Preparing",
    tone: "neutral",
    eta: "August 25, 2026 · 7:45 AM",
  },
  {
    id: "business-shipment-4",
    shipmentId: "BIZ-20260825-B",
    label: "Embassy reception network",
    route: "Belgium embassy route",
    scope: "2 sites / 60 copies",
    status: "Address review",
    tone: "warning",
    eta: "August 25, 2026 · Pending confirmation",
  },
];

export const businessShipmentRouteSummaries = [
  {
    id: "business-route-1",
    route: "Belgium North cluster",
    window: "August 11, 2026 · Morning dispatch",
    shipments: "2 active runs",
    destinations: "5 receiving points",
    status: "On track",
    tone: "success",
    note: "Hotel and headquarters deliveries share one regional release so invoice and receiving teams stay aligned.",
  },
  {
    id: "business-route-2",
    route: "Germany West corridor",
    window: "August 25, 2026 · Next cycle",
    shipments: "1 queued run",
    destinations: "2 receiving points",
    status: "Queued",
    tone: "neutral",
    note: "The next cross-border branch run is already grouped, but the receiving manifest stays editable before print lock.",
  },
  {
    id: "business-route-3",
    route: "Belgium embassy route",
    window: "August 25, 2026 · Address review",
    shipments: "1 review state",
    destinations: "2 receiving points",
    status: "Attention",
    tone: "warning",
    note: "One destination still needs a final receiving-contact confirmation before the shared route is released.",
  },
];

export const businessShipmentLocationRows = [
  {
    id: "business-location-1",
    location: "Brussels head office",
    region: "Belgium",
    copies: "70 copies",
    contact: "Facilities desk",
    status: "Delivered",
    tone: "success",
  },
  {
    id: "business-location-2",
    location: "Antwerp hotel lobby",
    region: "Belgium",
    copies: "55 copies",
    contact: "Morning concierge",
    status: "Receiving",
    tone: "info",
  },
  {
    id: "business-location-3",
    location: "Cologne branch office",
    region: "Germany",
    copies: "80 copies",
    contact: "Operations lead",
    status: "Queued",
    tone: "neutral",
  },
  {
    id: "business-location-4",
    location: "Embassy reception desk",
    region: "Belgium",
    copies: "30 copies",
    contact: "Reception review",
    status: "Confirm contact",
    tone: "warning",
  },
];

export const businessShipmentIssueStates = [
  {
    id: "business-shipment-issue-1",
    label: "Receiving readiness",
    summary: "One embassy reception point still needs a named receiving contact.",
    status: "Review",
    tone: "warning",
    icon: "MapPinned",
    detail:
      "The rest of the business footprint is already grouped into the next delivery cycle, so only that one branch blocks a fully clean release.",
  },
  {
    id: "business-shipment-issue-2",
    label: "Commercial routing",
    summary: "Invoice-linked shipments are still aligned to the current branch allocation plan.",
    status: "Aligned",
    tone: "success",
    icon: "ShieldCheck",
    detail:
      "Copy volume, route grouping, and invoice ownership remain synchronized across the shared business shipment view.",
  },
  {
    id: "business-shipment-issue-3",
    label: "Support path",
    summary: "No missed-drop dispute is open for the latest completed business run.",
    status: "Standby",
    tone: "neutral",
    icon: "LifeBuoy",
    detail:
      "If one site reports a missing bundle later, the issue can be attached to this same shared logistics surface without splitting the route layout.",
  },
];

export const businessShipmentActivityRows = [
  {
    id: "business-shipment-activity-1",
    event: "Antwerp hotel receiving confirmed",
    shipment: "BIZ-20260811-A",
    status: "Confirmed",
    tone: "success",
    date: "August 11, 2026 · 8:18 AM",
  },
  {
    id: "business-shipment-activity-2",
    event: "Embassy reception contact check requested",
    shipment: "BIZ-20260825-B",
    status: "Review",
    tone: "warning",
    date: "August 10, 2026 · 4:20 PM",
  },
  {
    id: "business-shipment-activity-3",
    event: "Cologne branch manifest updated",
    shipment: "BIZ-20260825-A",
    status: "Updated",
    tone: "info",
    date: "August 9, 2026 · 2:05 PM",
  },
  {
    id: "business-shipment-activity-4",
    event: "Next business route grouped for regional release",
    shipment: "BIZ-20260825-A",
    status: "Queued",
    tone: "neutral",
    date: "August 8, 2026 · 10:40 AM",
  },
];

export const businessOverviewMetrics = [
  {
    label: "Contract state",
    value: "Regional Team",
    detail: "Discounted multi-location agreement is active and invoice-ready.",
  },
  {
    label: "Copy volume",
    value: "475 copies",
    detail: "Current recurring volume across headquarters, branches, and partner desks.",
  },
  {
    label: "Next bulk delivery",
    value: "Aug 25",
    detail: "Next consolidated business release is already grouped for the upcoming cycle.",
    accent: true,
  },
  {
    label: "Invoice status",
    value: "Current",
    detail: "The latest consolidated invoice is paid and the next billing window is scheduled.",
  },
  {
    label: "Shipment health",
    value: "1 review note",
    detail: "Only one receiving-contact confirmation is blocking a fully clean route release.",
  },
];

export const businessOverviewDeliveryFootprint = [
  {
    label: "Active locations",
    value: "9 sites",
    detail: "Brussels, Antwerp, Cologne, and Berlin coverage remains inside one account.",
  },
  {
    label: "Primary contact",
    value: "Ops + finance",
    detail: "Receiving coordination and invoice ownership stay visible as separate functions.",
  },
  {
    label: "Next receiving window",
    value: "Morning route",
    detail: "The next consolidated drop targets the August 25, 2026 morning dispatch cycle.",
  },
];

export const businessOverviewCopyBars = [
  { label: "HQ", value: 140, tone: "accent" },
  { label: "Antwerp", value: 95, tone: "default" },
  { label: "Cologne", value: 110, tone: "accent" },
  { label: "Berlin", value: 80, tone: "default" },
  { label: "Partner", value: 50, tone: "default" },
];

export const businessOverviewActivityRows = [
  {
    id: "business-overview-1",
    item: "Invoice INV-BIZ-2026-08 confirmed",
    status: "Paid",
    tone: "success",
    date: "August 11, 2026",
  },
  {
    id: "business-overview-2",
    item: "Embassy receiving contact review opened",
    status: "Review",
    tone: "warning",
    date: "August 10, 2026",
  },
  {
    id: "business-overview-3",
    item: "Cologne branch copy allocation updated",
    status: "Updated",
    tone: "info",
    date: "August 8, 2026",
  },
  {
    id: "business-overview-4",
    item: "Next bulk release grouped for August 25 cycle",
    status: "Queued",
    tone: "neutral",
    date: "August 7, 2026",
  },
];

export const businessOverviewQuickActions = [
  {
    id: "team",
    label: "Team",
    detail: "Manage seats, roles, and invitation readiness for commercial and receiving users.",
    route: "/business-dashboard/team",
  },
  {
    id: "orders",
    label: "Orders",
    detail: "Adjust recurring volume and review bulk-copy assumptions by location.",
    route: "/business-dashboard/orders",
  },
  {
    id: "invoices",
    label: "Invoices",
    detail: "Review consolidated billing, invoice history, and payment follow-up.",
    route: "/business-dashboard/invoices",
  },
  {
    id: "locations",
    label: "Locations",
    detail: "Inspect branch coverage, receiving contacts, and delivery destination health.",
    route: "/business-dashboard/locations",
  },
  {
    id: "shipments",
    label: "Shipments",
    detail: "Open the dedicated logistics workspace for route summaries and location-level status.",
    route: "/business-dashboard/shipments",
  },
];

export const businessTeamMetrics = [
  {
    label: "Active seats",
    value: "12 users",
    detail: "Commercial, finance, and receiving roles are split across the active workspace.",
  },
  {
    label: "Billing approvers",
    value: "2",
    detail: "Two finance owners can confirm invoice follow-up and payment expectations.",
  },
  {
    label: "Receiving leads",
    value: "4",
    detail: "Each branch cluster has a named receiving owner ahead of the next print cycle.",
    accent: true,
  },
  {
    label: "Pending invites",
    value: "1",
    detail: "One embassy desk seat still needs activation before the next route release.",
  },
];

export const businessTeamRows = [
  {
    id: "business-team-1",
    name: "Sajibur Rahman",
    role: "Account owner",
    scope: "Commercial + oversight",
    status: "Active",
    tone: "success",
    updated: "August 11, 2026",
  },
  {
    id: "business-team-2",
    name: "Lina Van Hove",
    role: "Finance lead",
    scope: "Invoices + VAT follow-up",
    status: "Active",
    tone: "success",
    updated: "August 10, 2026",
  },
  {
    id: "business-team-3",
    name: "Marco Stein",
    role: "Receiving coordinator",
    scope: "Belgium North cluster",
    status: "Active",
    tone: "info",
    updated: "August 9, 2026",
  },
  {
    id: "business-team-4",
    name: "Embassy desk invite",
    role: "Receiving contact",
    scope: "Embassy reception route",
    status: "Pending",
    tone: "warning",
    updated: "August 8, 2026",
  },
];

export const businessTeamInviteCards = [
  {
    title: "Commercial ownership",
    detail: "Keep at least one account owner and one finance approver active so contract and invoice actions do not bottleneck on a single person.",
    icon: "team",
  },
  {
    title: "Receiving coordination",
    detail: "Sites with physical drops should always have a named receiving lead before the next regional dispatch window opens.",
    icon: "receiving",
  },
  {
    title: "Invite readiness",
    detail: "Pending invites should stay visible when a new branch, concierge desk, or reception team needs access before rollout expands.",
    icon: "team",
  },
];

export const businessOrderMetrics = [
  {
    label: "Recurring volume",
    value: "475 copies",
    detail: "Current allocation across headquarters, branches, hospitality, and partner points.",
  },
  {
    label: "Active order plans",
    value: "4",
    detail: "Each order plan groups one repeat pattern instead of forcing all locations into one flat order.",
  },
  {
    label: "Next release",
    value: "August 25",
    detail: "The next business print cycle is already grouped and ready for final volume review.",
    accent: true,
  },
{
    label: "Order pricing",
    value: "€1.05 / copy",
    detail: "The per-copy estimate drops as requested volume grows, and an account manager confirms the final rate.",
  },
];

export const businessOrderRows = [
  {
    id: "business-order-1",
    order: "Belgium headquarters pack",
    copies: "140 copies",
    cadence: "Biweekly",
    sites: "2 sites",
    status: "Active",
    tone: "success",
    nextWindow: "August 25, 2026",
  },
  {
    id: "business-order-2",
    order: "Germany branch circulation",
    copies: "190 copies",
    cadence: "Biweekly",
    sites: "3 sites",
    status: "Adjusted",
    tone: "info",
    nextWindow: "August 25, 2026",
  },
  {
    id: "business-order-3",
    order: "Hospitality reception bundle",
    copies: "95 copies",
    cadence: "Biweekly",
    sites: "2 sites",
    status: "Review",
    tone: "warning",
    nextWindow: "Awaiting contact confirmation",
  },
  {
    id: "business-order-4",
    order: "Embassy partner drop",
    copies: "50 copies",
    cadence: "Biweekly",
    sites: "2 sites",
    status: "Queued",
    tone: "neutral",
    nextWindow: "Next cycle after review",
  },
];

export const businessOrderVolumeBars = [
  { label: "HQ", value: 140, tone: "accent" },
  { label: "Branch", value: 190, tone: "default" },
  { label: "Hotel", value: 95, tone: "default" },
  { label: "Partner", value: 50, tone: "default" },
];

export const businessInvoiceMetrics = [
  {
    label: "Invoice health",
    value: "Current",
    detail: "The latest consolidated invoice is paid and no overdue balance is active.",
  },
  {
    label: "Next invoice",
    value: "Sept 1",
    detail: "The next monthly invoice remains aligned to the current Regional Team contract.",
    accent: true,
  },
  {
    label: "Payment path",
    value: "Monthly invoice",
    detail: "The account uses invoice handling instead of reader-style self-serve renewals.",
  },
  {
    label: "Open follow-ups",
    value: "1 note",
    detail: "One VAT-routing note still needs confirmation before the next invoice is issued.",
  },
];

export const businessInvoiceRows = [
  {
    id: "business-invoice-1",
    invoice: "INV-BIZ-2026-08",
    scope: "August business circulation",
    amount: "EUR 8,950",
    status: "Paid",
    tone: "success",
    date: "August 11, 2026",
  },
  {
    id: "business-invoice-2",
    invoice: "INV-BIZ-2026-07",
    scope: "July business circulation",
    amount: "EUR 8,630",
    status: "Paid",
    tone: "success",
    date: "July 11, 2026",
  },
  {
    id: "business-invoice-3",
    invoice: "VAT note review",
    scope: "Germany branch allocation",
    amount: "Pending",
    status: "Review",
    tone: "warning",
    date: "August 8, 2026",
  },
  {
    id: "business-invoice-4",
    invoice: "INV-BIZ-2026-09",
    scope: "Projected September cycle",
    amount: "EUR 9,120",
    status: "Upcoming",
    tone: "neutral",
    date: "September 1, 2026",
  },
];

export const businessLocationMetrics = [
  {
    label: "Active sites",
    value: "9 locations",
    detail: "The business footprint spans offices, hospitality, and partner-facing desks.",
  },
  {
    label: "Countries",
    value: "2",
    detail: "Belgium and Germany remain active in the current delivery footprint.",
  },
  {
    label: "Receiving contacts",
    value: "8 assigned",
    detail: "Most destinations already have a named receiving owner tied to the active route plan.",
    accent: true,
  },
  {
    label: "Needs review",
    value: "1 site",
    detail: "One embassy reception point still needs final contact confirmation.",
  },
];

export const businessLocationRows = [
  {
    id: "business-site-1",
    location: "Brussels head office",
    region: "Belgium",
    copies: "70 copies",
    contact: "Facilities desk",
    status: "Ready",
    tone: "success",
  },
  {
    id: "business-site-2",
    location: "Antwerp hotel lobby",
    region: "Belgium",
    copies: "55 copies",
    contact: "Morning concierge",
    status: "Ready",
    tone: "success",
  },
  {
    id: "business-site-3",
    location: "Cologne branch office",
    region: "Germany",
    copies: "80 copies",
    contact: "Operations lead",
    status: "Updated",
    tone: "info",
  },
  {
    id: "business-site-4",
    location: "Berlin partner lounge",
    region: "Germany",
    copies: "45 copies",
    contact: "Site host",
    status: "Ready",
    tone: "success",
  },
  {
    id: "business-site-5",
    location: "Embassy reception desk",
    region: "Belgium",
    copies: "30 copies",
    contact: "Reception review",
    status: "Review",
    tone: "warning",
  },
];

export const adminOverviewMetrics = [
  {
    label: "Published today",
    value: "12 stories",
    detail: "Morning and midday releases are already live across the sector desks.",
  },
  {
    label: "Scheduled queue",
    value: "8 items",
    detail: "The current schedule includes later releases and print-linked publishing work.",
  },
  {
    label: "Subscriber watchlist",
    value: "37 accounts",
    detail: "A small set of renewals, delivery eligibility checks, and support reviews need attention.",
  },
  {
    label: "Company accounts",
    value: "46 active",
    detail: "Business onboarding and active contracts are currently spread across Belgium and Germany.",
  },
  {
    label: "Routes delayed",
    value: "2 corridors",
    detail: "Only two outbound route groups need escalation before the current window closes.",
    accent: true,
  },
];

export const adminOverviewAccountHealth = [
  {
    label: "Active subscribers",
    value: "24.3k",
    detail: "Most individual accounts remain active, with only a narrow review set tied to billing or delivery state.",
  },
  {
    label: "Business contracts",
    value: "46",
detail: "Company accounts price their bulk orders at a per-copy rate that depends on their requested copy volume.",
  },
  {
    label: "Order volume",
    value: "21 accounts",
    detail: "Most company accounts run recurring copy volumes within the mid-volume estimate band.",
    accent: true,
  },
];

export const adminOverviewPublishingBars = [
  { label: "Mon", value: 9, tone: "default" },
  { label: "Tue", value: 12, tone: "accent" },
  { label: "Wed", value: 8, tone: "default" },
  { label: "Thu", value: 11, tone: "accent" },
  { label: "Fri", value: 10, tone: "default" },
];

export const adminOverviewActivityRows = [
  {
    id: "admin-overview-1",
    item: "Morning politics queue published",
    status: "Published",
    tone: "success",
    date: "August 11, 2026 · 9:05 AM",
  },
  {
    id: "admin-overview-2",
    item: "Subscriber renewal review batch opened",
    status: "In progress",
    tone: "info",
    date: "August 11, 2026 · 8:20 AM",
  },
  {
    id: "admin-overview-3",
    item: "Germany West route delay escalated",
    status: "Needs review",
    tone: "warning",
    date: "August 11, 2026 · 7:55 AM",
  },
  {
    id: "admin-overview-4",
    item: "Two new business onboarding requests logged",
    status: "Queued",
    tone: "neutral",
    date: "August 10, 2026 · 5:10 PM",
  },
];

export const adminOverviewQuickActions = [
  {
    id: "content",
    label: "Content",
    detail: "Review the publishing queue, article states, and editorial records.",
    route: "/admin/content",
  },
  {
    id: "schedule",
    label: "Schedule",
    detail: "Open the scheduled publishing workspace for timed releases and print coordination.",
    route: "/admin/schedule",
  },
  {
    id: "subscribers",
    label: "Subscribers",
    detail: "Inspect subscriber status, renewals, delivery eligibility, and support cases.",
    route: "/admin/subscribers",
  },
  {
    id: "companies",
    label: "Companies",
    detail: "Review business accounts, onboarding state, and contract summaries.",
    route: "/admin/companies",
  },
  {
    id: "shipments",
    label: "Shipments",
    detail: "Monitor outbound route health, escalations, and fulfillment readiness.",
    route: "/admin/shipments",
  },
{
    id: "order-requests",
    label: "Order requests",
    detail: "Review pending bulk-order requests and confirm final prices.",
    route: "/admin/order-requests",
  },
];

export const adminContentMetrics = [
  {
    label: "Drafts",
    value: "5",
    detail: "Draft pieces are waiting on editor review or sector-specific field completion.",
  },
  {
    label: "Scheduled",
    value: "8",
    detail: "The publishing queue already contains several later releases and print-linked items.",
    accent: true,
  },
  {
    label: "Published today",
    value: "12",
    detail: "Morning and midday newsroom releases are already live for subscribers.",
  },
  {
    label: "Template desks",
    value: "4",
    detail: "Politics, business, sports, and events all follow structured editorial templates.",
  },
];

export const adminContentRows = [
  {
    id: "admin-content-1",
    headline: "Policy desk briefs transport and labor votes for the midday edition",
    sector: "Politics",
    editor: "Nadia Okello",
    status: "Published",
    tone: "success",
    publishWindow: "August 11, 2026 · 11:00 AM",
  },
  {
    id: "admin-content-2",
    headline: "Freight and retail outlook queued for the evening business release",
    sector: "Business",
    editor: "Thomas Chen",
    status: "Scheduled",
    tone: "info",
    publishWindow: "August 11, 2026 · 6:00 PM",
  },
  {
    id: "admin-content-3",
    headline: "Weekend fixtures package waiting on final injury notes",
    sector: "Sports",
    editor: "Maria Santos",
    status: "Draft",
    tone: "neutral",
    publishWindow: "Awaiting editor sign-off",
  },
  {
    id: "admin-content-4",
    headline: "Events listing bundle held for venue confirmation",
    sector: "Events",
    editor: "Emily Rossini",
    status: "Scheduled",
    tone: "warning",
    publishWindow: "August 12, 2026 · 8:00 AM",
  },
];

export const adminEditorArticles = [
  {
    id: "admin-politics-1",
    headline: "Policy desk briefs transport and labor votes for the midday edition",
    sector: "Politics",
    editor: "Nadia Okello",
    status: "Published",
    tone: "success",
    summary:
      "The politics desk is packaging transport, labor, and council developments into one structured midday subscriber release.",
    author: "Nadia Okello",
    publicAccessDate: "September 10, 2026",
    publishDate: "August 11, 2026",
    publishTime: "11:00 AM",
    body:
      "Regional editors are consolidating policy votes, committee changes, and labor reactions into a single subscriber edition before the public archive window opens next month.",
    councilSession: "Federal transport and labor committee",
    location: "Brussels",
  },
  {
    id: "admin-business-1",
    headline: "Freight and retail outlook queued for the evening business release",
    sector: "Business",
    editor: "Thomas Chen",
    status: "Scheduled",
    tone: "info",
    summary:
      "The business desk is linking freight throughput, retail demand, and distribution cost signals into the evening release.",
    author: "Thomas Chen",
    publicAccessDate: "September 11, 2026",
    publishDate: "August 11, 2026",
    publishTime: "6:00 PM",
    body:
      "Analysts are aligning port throughput, warehouse cadence, and retail planning so the evening story supports both subscriber reading and internal business planning context.",
    marketImpact: "Port throughput and retail demand",
    location: "Antwerp and Cologne",
  },
  {
    id: "admin-sports-1",
    headline: "Weekend fixtures package waiting on final injury notes",
    sector: "Sports",
    editor: "Maria Santos",
    status: "Draft",
    tone: "neutral",
    summary:
      "The sports desk still needs final squad and injury context before the next fixtures package can be scheduled.",
    author: "Maria Santos",
    publicAccessDate: "September 12, 2026",
    publishDate: "August 12, 2026",
    publishTime: "9:30 AM",
    body:
      "Live alerts are already flowing, but the longer-form subscriber package still needs final pre-match verification and print-summary framing.",
    scorelineFocus: "Weekend league fixtures and injury notes",
    location: "Brussels and regional stadiums",
  },
  {
    id: "admin-events-1",
    headline: "Events listing bundle held for venue confirmation",
    sector: "Events",
    editor: "Emily Rossini",
    status: "Scheduled",
    tone: "warning",
    summary:
      "The events desk is holding the next listings bundle until venue and sponsor confirmations are fully checked.",
    author: "Emily Rossini",
    publicAccessDate: "September 12, 2026",
    publishDate: "August 12, 2026",
    publishTime: "8:00 AM",
    body:
      "The listings package is structurally ready, but several venue confirmations and local sponsor details still need a final editorial pass before release.",
    eventDate: "August 16-18, 2026",
    location: "Brussels, Antwerp, and Berlin",
  },
];

export const adminEditorTemplateFields = {
  News: [
    {
      key: "councilSession",
      label: "Institution or session",
      placeholder: "Council, parliament, or committee session",
      hint: "News coverage usually needs the decision-making body or vote context.",
    },
    {
      key: "location",
      label: "Policy region",
      placeholder: "Brussels",
      hint: "Keep the geographic scope explicit for public-affairs coverage.",
    },
  ],
  Business: [
    {
      key: "marketImpact",
      label: "Market or logistics angle",
      placeholder: "Freight, pricing, or retail effect",
      hint: "Business stories should keep the operational and commercial angle easy to scan.",
    },
    {
      key: "location",
      label: "Operating region",
      placeholder: "Antwerp and Cologne",
      hint: "Use region context when commercial or logistics effects vary by market.",
    },
  ],
  Events: [
    {
      key: "scorelineFocus",
      label: "Fixture or analysis focus",
      placeholder: "Matchday, injury notes, or analysis angle",
      hint: "Events packages should keep the performance focus visible before print summaries are prepared.",
    },
    {
      key: "eventDate",
      label: "Event date or range",
      placeholder: "August 16-18, 2026",
      hint: "Events listings need explicit date coverage for publish and print workflows.",
    },
    {
      key: "location",
      label: "Venue or city",
      placeholder: "Brussels",
      hint: "Location fields keep regional event bundles structured and searchable.",
    },
  ],
};

export const adminScheduleMetrics = [
  {
    label: "Scheduled today",
    value: "8 items",
    detail: "The release queue currently spans midday, evening, and next-morning publishing slots.",
  },
  {
    label: "Print-linked",
    value: "3",
    detail: "Three upcoming items also influence the next print edition workflow.",
    accent: true,
  },
  {
    label: "Review holds",
    value: "2",
    detail: "A small set of stories still needs editorial or venue confirmation before release.",
  },
  {
    label: "Future slots",
    value: "5 days",
    detail: "The visible schedule now stretches across the next five publishing days.",
  },
];

export const adminScheduleRows = [
  {
    id: "admin-schedule-1",
    slot: "August 11, 2026 · 2:00 PM",
    sector: "Politics",
    headline: "Municipal policy wrap and labor reaction package",
    status: "Scheduled",
    tone: "info",
    release: "Subscriber release",
  },
  {
    id: "admin-schedule-2",
    slot: "August 11, 2026 · 6:00 PM",
    sector: "Business",
    headline: "Freight, pricing, and retail outlook",
    status: "Scheduled",
    tone: "info",
    release: "Subscriber + print planning",
  },
  {
    id: "admin-schedule-3",
    slot: "August 12, 2026 · 8:00 AM",
    sector: "Events",
    headline: "Weekend listings bundle",
    status: "Needs review",
    tone: "warning",
    release: "Pending venue confirmation",
  },
  {
    id: "admin-schedule-4",
    slot: "August 12, 2026 · 9:30 AM",
    sector: "Sports",
    headline: "Matchday package and injury recap",
    status: "Draft",
    tone: "neutral",
    release: "Awaiting final desk sign-off",
  },
];

export const adminScheduleVolumeBars = [
  { label: "Tue", value: 8, tone: "accent" },
  { label: "Wed", value: 6, tone: "default" },
  { label: "Thu", value: 5, tone: "default" },
  { label: "Fri", value: 7, tone: "accent" },
  { label: "Sat", value: 4, tone: "default" },
];

export const adminSubscriberMetrics = [
  {
    label: "Active subscribers",
    value: "24.3k",
    detail: "Most accounts remain active, with only a narrow review set tied to billing or delivery status.",
  },
  {
    label: "Renewals due",
    value: "14 today",
    detail: "A small set of renewals needs front-desk or billing follow-up before the current cycle closes.",
    accent: true,
  },
  {
    label: "Delivery holds",
    value: "9",
    detail: "Address or payment conditions currently block a small set of print-eligible accounts.",
  },
  {
    label: "Support reviews",
    value: "37",
    detail: "The review queue spans missed-delivery, renewal, and access-state questions.",
  },
];

export const adminSubscriberRows = [
  {
    id: "admin-subscriber-1",
    name: "Amelie Laurent",
    plan: "Print + Digital · Yearly",
    renewal: "September 1, 2026",
    deliveryEligibility: "Eligible",
    status: "Active",
    tone: "success",
  },
  {
    id: "admin-subscriber-2",
    name: "Jonas Stein",
    plan: "Print + Digital · Monthly",
    renewal: "August 12, 2026",
    deliveryEligibility: "Address review",
    status: "Needs review",
    tone: "warning",
  },
  {
    id: "admin-subscriber-3",
    name: "Marta Kovacs",
    plan: "Digital Only · Monthly",
    renewal: "August 18, 2026",
    deliveryEligibility: "Digital only",
    status: "Active",
    tone: "info",
  },
  {
    id: "admin-subscriber-4",
    name: "Niels Verbruggen",
    plan: "Print + Digital · Yearly",
    renewal: "August 11, 2026",
    deliveryEligibility: "Payment hold",
    status: "Renewal watch",
    tone: "warning",
  },
];

export const adminCompanyMetrics = [
  {
    label: "Active companies",
    value: "46",
detail: "Company accounts price their bulk orders at a per-copy rate set by requested volume.",
  },
  {
    label: "Recurring volumes",
    value: "21 accounts",
    detail: "Most company accounts run confirmed recurring copy volumes once their order requests are approved.",
    accent: true,
  },
  {
    label: "Invoice review",
    value: "6 accounts",
    detail: "A small group of companies still needs invoice or VAT clarification before the next cycle.",
  },
  {
    label: "Cross-border",
    value: "12 accounts",
    detail: "Several businesses operate across both Belgium and Germany, increasing routing and billing complexity.",
  },
];

export const adminCompanyRows = [
  {
    id: "admin-company-1",
company: "Atlas Hotels Belgium",
    volume: "180 copies / cycle",
    billing: "Monthly invoice",
    status: "Active",
    tone: "success",
    region: "Belgium",
  },
  {
    id: "admin-company-2",
company: "Meridian Trade Offices",
    volume: "95 copies / cycle",
    billing: "Monthly invoice",
    status: "Active",
    tone: "info",
    region: "Belgium",
  },
  {
    id: "admin-company-3",
company: "Rhine Partner Lounges",
    volume: "140 copies / cycle",
    billing: "Contract billing",
    status: "Invoice review",
    tone: "warning",
    region: "Germany",
  },
  {
    id: "admin-company-4",
company: "Embassy reception network",
    volume: "60 copies / cycle",
    billing: "Contract billing",
    status: "Onboarding",
    tone: "neutral",
    region: "Belgium + Germany",
  },
];

export const companyOrderRequests = [
  {
    id: "order-request-seed-1",
    companyAccountId: "business-account-1",
    company: `${appParams.appName} Distribution Group`,
    copies: 475,
    neededBy: "2026-09-25",
    deliveryLocations: ["Brussels HQ", "Antwerp (HQ)", "Cologne", "Berlin"],
    estimatedPrice: 498.75,
    rate: 1.05,
    status: "Approved",
    tone: "success",
    finalPrice: 498.75,
    requestedBy: null,
    reviewedBy: null,
    reviewedAt: "2026-01-14T14:30:00Z",
    createdAt: "2026-01-12T09:00:00Z",
    updatedAt: "2026-01-14T14:30:00Z",
  },
  {
    id: "order-request-seed-2",
    companyAccountId: "business-account-1",
    company: `${appParams.appName} Distribution Group`,
    copies: 380,
    neededBy: "2026-10-02",
    deliveryLocations: ["Brussels HQ", "Antwerp", "Cologne"],
    estimatedPrice: 399.0,
    rate: 1.05,
    status: "Pending approval",
    tone: "warning",
    finalPrice: null,
    requestedBy: null,
    reviewedBy: null,
    reviewedAt: "",
    createdAt: "2026-01-18T08:00:00Z",
    updatedAt: "",
  },
  {
    id: "order-request-seed-3",
    companyAccountId: "admin-company-1",
    company: "Atlas Hotels Belgium",
    copies: 240,
    neededBy: "2026-10-09",
    deliveryLocations: ["Atlas Brussels", "Atlas Antwerp"],
    estimatedPrice: 252.0,
    rate: 1.05,
    status: "Pending approval",
    tone: "warning",
    finalPrice: null,
    requestedBy: null,
    reviewedBy: null,
    reviewedAt: "",
    createdAt: "2026-01-20T10:00:00Z",
    updatedAt: "",
  },
];

export const adminShipmentActivityRows = [
  {
    id: "admin-shipment-activity-1",
    event: "Germany West delay escalation assigned to fleet desk",
    shipment: "OPS-20260811-02",
    status: "Escalated",
    tone: "warning",
    date: "August 11, 2026 · 8:10 AM",
  },
  {
    id: "admin-shipment-activity-2",
    event: "Brussels central subscriber route confirmed",
    shipment: "OPS-20260811-03",
    status: "Confirmed",
    tone: "success",
    date: "August 11, 2026 · 7:58 AM",
  },
  {
    id: "admin-shipment-activity-3",
    event: "Berlin prep manifest synced for next release window",
    shipment: "OPS-20260825-04",
    status: "Updated",
    tone: "info",
    date: "August 10, 2026 · 5:15 PM",
  },
  {
    id: "admin-shipment-activity-4",
    event: "Hospitality route stop count adjusted after receiving update",
    shipment: "OPS-20260811-01",
    status: "Queued",
    tone: "neutral",
    date: "August 10, 2026 · 4:05 PM",
  },
];

export const adminShipmentKpis = [
  {
    label: "Outbound shipments",
    value: "24",
    detail: "Operations can watch all active company and subscriber routes from one admin delivery surface.",
    icon: "Package",
  },
  {
    label: "Delayed routes",
    value: "2",
    detail: "Two active corridors need intervention before the next delivery window closes.",
    icon: "CalendarClock",
    accent: true,
  },
  {
    label: "Drop confirmation",
    value: "91%",
    detail: "Most active routes already have clean doorstep or receiving confirmations.",
    icon: "ShieldCheck",
  },
];

export const adminShipmentRows = [
  {
    id: "admin-shipment-1",
    shipmentId: "OPS-20260811-01",
    label: "Reader and hotel mix · Belgium North",
    route: "Belgium North cluster",
    scope: "8 stops / 320 copies",
    status: "In dispatch",
    tone: "info",
    eta: "August 11, 2026 · 8:15 AM",
  },
  {
    id: "admin-shipment-2",
    shipmentId: "OPS-20260811-02",
    label: "Business branch run · Germany West",
    route: "Germany West corridor",
    scope: "6 stops / 420 copies",
    status: "Delay flagged",
    tone: "warning",
    eta: "August 11, 2026 · 9:05 AM",
  },
  {
    id: "admin-shipment-3",
    shipmentId: "OPS-20260811-03",
    label: "Subscriber route · Brussels central",
    route: "Brussels central corridor",
    scope: "5 stops / 110 copies",
    status: "Delivered",
    tone: "success",
    eta: "August 11, 2026 · 7:58 AM",
  },
  {
    id: "admin-shipment-4",
    shipmentId: "OPS-20260825-04",
    label: "Cross-border prep · Berlin and Cologne",
    route: "Germany East prep",
    scope: "5 stops / 260 copies",
    status: "Preparing",
    tone: "neutral",
    eta: "August 25, 2026 · Pre-release",
  },
];

export const adminShipmentRouteSummaries = [
  {
    id: "admin-route-1",
    route: "Belgium North cluster",
    window: "August 11, 2026 · Live morning run",
    shipments: "9 active shipments",
    destinations: "31 stops",
    status: "Stable",
    tone: "success",
    note: "Subscriber and business bundles are moving inside the expected release window with clean receiving confirmations.",
  },
  {
    id: "admin-route-2",
    route: "Germany West corridor",
    window: "August 11, 2026 · Delay escalation",
    shipments: "6 active shipments",
    destinations: "22 stops",
    status: "Delayed",
    tone: "warning",
    note: "Truck assignment drifted beyond the planned dispatch window, so affected business branches are held in one visible exception lane.",
  },
  {
    id: "admin-route-3",
    route: "Germany East prep",
    window: "August 25, 2026 · Upcoming release",
    shipments: "5 queued shipments",
    destinations: "19 stops",
    status: "Queued",
    tone: "neutral",
    note: "The next cycle is already grouped so operations can inspect route health before the fleet integration begins streaming live status.",
  },
];

export const adminShipmentLocationRows = [
  {
    id: "admin-location-1",
    location: "Brussels subscriber cluster",
    region: "Belgium",
    copies: "110 copies",
    contact: "Doorstep confirmations",
    status: "Delivered",
    tone: "success",
  },
  {
    id: "admin-location-2",
    location: "Antwerp hospitality route",
    region: "Belgium",
    copies: "140 copies",
    contact: "Concierge team",
    status: "Receiving",
    tone: "info",
  },
  {
    id: "admin-location-3",
    location: "Cologne branch network",
    region: "Germany",
    copies: "180 copies",
    contact: "Operations desk",
    status: "Delay watch",
    tone: "warning",
  },
  {
    id: "admin-location-4",
    location: "Berlin expansion route",
    region: "Germany",
    copies: "95 copies",
    contact: "Fleet prep",
    status: "Queued",
    tone: "neutral",
  },
];

export const adminShipmentIssueStates = [
  {
    id: "admin-shipment-issue-1",
    label: "Delay escalation",
    summary: "Germany West remains the only active corridor with a live dispatch delay.",
    status: "Escalated",
    tone: "warning",
    icon: "AlertTriangle",
    detail:
      "Operations can keep the flagged route visible here while still monitoring all other outbound shipments in the same admin workspace.",
  },
  {
    id: "admin-shipment-issue-2",
    label: "Coverage health",
    summary: "Belgium North and Brussels central runs are still confirming at the expected pace.",
    status: "Healthy",
    tone: "success",
    icon: "ShieldCheck",
    detail:
      "Most active stops already have clean receiving or doorstep confirmation, which keeps the wider network from looking noisier than it is.",
  },
  {
    id: "admin-shipment-issue-3",
    label: "Ops support path",
    summary: "One branch is waiting on fleet follow-up, but no broader customer incident is open yet.",
    status: "Standby",
    tone: "neutral",
    icon: "LifeBuoy",
    detail:
      "Future integrations can connect support tickets, reroute notes, and callback outcomes into this same issue-state pattern.",
  },
];

export const readerBillingRows = [
  {
    id: "invoice-1",
    item: "Invoice INV-2026-08",
    amount: "€24.99",
    status: "Paid",
    tone: "success",
    date: "August 11, 2026",
  },
  {
    id: "invoice-2",
    item: "Invoice INV-2026-07",
    amount: "€24.99",
    status: "Paid",
    tone: "success",
    date: "July 11, 2026",
  },
  {
    id: "invoice-3",
    item: "Renewal reminder",
    amount: "€24.99",
    status: "Upcoming",
    tone: "warning",
    date: "September 11, 2026",
  },
  {
    id: "invoice-4",
    item: "Payment method check",
    amount: "PayPal",
    status: "Verified",
    tone: "info",
    date: "August 10, 2026",
  },
];

export const readerBillingQuickFacts = [
  {
    label: "Current plan",
    value: "Print + Digital",
    detail: "Includes subscriber-first access plus physical delivery every two weeks.",
  },
  {
    label: "Renewal cycle",
    value: "Monthly",
    detail: "Future yearly plans should still render the same billing workspace structure.",
  },
  {
    label: "Payment path",
    value: "PayPal",
    detail: "The live processor reference would be stored outside raw card data handling.",
  },
];

export const readerHistoryRows = [
  {
    id: "history-1",
    item: "City Council Approves New Waterline and Road Repair Program",
    category: "News",
    status: "Read today",
    tone: "info",
    date: "August 11, 2026",
  },
  {
    id: "history-2",
    item: "Family-Owned Logistics Firm Expands After Securing Regional Contract",
    category: "Business",
    status: "Saved",
    tone: "success",
    date: "August 10, 2026",
  },
  {
    id: "history-3",
    item: "The Vanishing Art of the Morning Paper",
    category: "Feature",
    status: "Archive soon",
    tone: "warning",
    date: "August 9, 2026",
  },
  {
    id: "history-4",
    item: "Local Couple Celebrates 50 Years of Marriage Surrounded by Family",
    category: "Community",
    status: "Completed",
    tone: "neutral",
    date: "August 8, 2026",
  },
];

export const readerSavedCollections = [
  {
    id: "saved-collection-1",
    title: "Morning briefing queue",
    detail:
      "The set of politics, business, and route-related stories you are likely to continue before the next print cycle.",
    route: "/article/news-1",
  },
  {
    id: "saved-collection-2",
    title: "Subscriber-first features",
    detail:
      "Long-form pieces still inside the paid access window and worth revisiting before they drift into the delayed archive.",
    route: "/article/feat-1",
  },
  {
    id: "saved-collection-3",
    title: "Logistics and business follow-up",
    detail:
      "Saved reporting that helps explain the same distribution and operations themes present in the product itself.",
    route: "/article/business-1",
  },
];

export const deliveryCoveragePoints = [
  {
    label: "Cadence",
    value: "Biweekly print delivery",
  },
  {
    label: "Tracking source",
    value: "Existing fleet and map system",
  },
  {
    label: "Coverage",
    value: "Belgium and Germany routing ready",
  },
];

export const businessBenefits = [
  {
    title: "Bulk copy management",
    desc: "Order physical newspapers in volume for offices, receptions, hotels, and partner sites.",
  },
  {
    title: "Volume-based pricing",
    desc: "Company pricing can scale by order size instead of using individual-reader plan rules.",
  },
  {
    title: "Consolidated invoicing",
    desc: "Handle billing and renewal activity from one place instead of splitting charges across staff accounts.",
  },
  {
    title: "Multi-location tracking",
    desc: "Monitor shipment progress across several delivery points from a shared company workspace.",
  },
];

export const businessHighlights = [
  {
    label: "Account model",
    value: "Individual and business flows stay separate",
  },
  {
    label: "Billing",
    value: "Contract and invoice-friendly",
  },
  {
    label: "Delivery view",
    value: "Single-location or consolidated route tracking",
  },
];

export const businessLandingStats = [
  {
    label: "Order model",
    value: "Bulk copies per delivery cycle",
    detail: "Business accounts are structured around copy volume, not single-reader plan rules.",
  },
  {
    label: "Billing model",
    value: "Invoice or contract-ready",
    detail: "Commercial orders can move through consolidated invoicing instead of consumer-style self-serve renewal only.",
  },
  {
    label: "Delivery model",
    value: "Single site or multi-location routing",
    detail: "The same workspace can cover one office, several branches, or regional partner locations.",
  },
  {
    label: "Operating region",
    value: "Belgium and Germany",
    detail: "Built with EU routing, VAT awareness, and regional logistics in mind.",
  },
];

export const businessLandingFeatures = [
  {
    title: "Bulk copy planning",
    desc: "Plan how many newspapers each office, reception, hotel, or client site should receive on each delivery cycle.",
  },
  {
    title: "Consolidated invoicing",
    desc: "Keep company billing separate from ordinary reader subscriptions with invoice-friendly payment handling and contract expectations.",
  },
  {
    title: "Location management",
    desc: "Track delivery destinations by branch or site instead of forcing every order into one household-style address model.",
  },
  {
    title: "Operational shipment visibility",
    desc: "Monitor one consolidated business shipment view instead of several isolated reader-level deliveries.",
  },
  {
    title: "Volume pricing logic",
    desc: "Pricing can scale by copy count and organizational footprint instead of using flat reader rates for every account.",
  },
  {
    title: "Company workspace",
    desc: "Teams get a dedicated dashboard for orders, invoices, locations, and shipment health rather than sharing a consumer account.",
  },
];

export const businessDeliveryLocations = [
  {
    title: "Head office delivery",
    detail: "One central office can receive a single recurring drop with a named billing contact and a simple receiving workflow.",
  },
  {
    title: "Multi-branch rollout",
    detail: "Several city or regional offices can be grouped into one account while still tracking delivery by destination.",
  },
  {
    title: "Hospitality and partner sites",
detail: "Hotels, lounges, retail counters, and client-facing locations can receive their own copy allocations per cycle.",
  },
];

export const businessContactCards = [
  {
    title: "Commercial email",
    detail: "business@newsletter.local",
    note: "Best for quote requests, invoicing questions, and commercial rollout planning.",
    href: "mailto:business@newsletter.local?subject=Business%20Inquiry",
    action: "Email commercial team",
  },
  {
    title: "Billing desk",
    detail: "billing@newsletter.local",
    note: "Use this for invoice structure, VAT questions, or company payment expectations.",
    href: "mailto:billing@newsletter.local?subject=Business%20Billing",
    action: "Contact billing",
  },
  {
    title: "Business intake",
    detail: "Start with your expected volume and delivery footprint.",
    note: "The intake path should include organization details, locations, volume, and invoicing preferences.",
    href: "/business#business-intake",
    action: "Open intake section",
  },
];

export const privacyPrinciples = [
  {
    title: "Data collected at sign-up",
    body: "The platform needs name, contact details, delivery address, account type, and payment references so it can create the correct subscription, delivery, and billing records.",
  },
  {
    title: "Why delivery addresses matter",
    body: "Delivery addresses are used to determine shipment routing and may be shared with the courier or fleet-integrated logistics workflow that powers physical newspaper delivery.",
  },
  {
    title: "How payments stay safer",
    body: "Raw card numbers should not be stored in the platform database. Payment details are expected to be captured and vaulted by a PCI-compliant processor, with the platform retaining only a reference token.",
  },
  {
    title: "How consent should be presented",
    body: "Consent needs to be explicit at sign-up, especially when personal data supports billing, account management, and delivery coordination across Belgium and Germany.",
  },
];

export const privacyRights = [
  "Access the personal data stored for your account.",
  "Request export of your account and subscription-related data.",
  "Request deletion or retention review where legal and operational obligations allow it.",
  "Understand when address data is shared with logistics or payment partners.",
];

export const privacyRetentionNotes = [
  "Account and subscription records should be retained only as long as operational, legal, and billing obligations require.",
  "Delivery and shipment history may need limited retention to resolve disputes, missed deliveries, or account support issues.",
  "Business-account invoicing records may require longer retention than ordinary reader marketing preferences.",
];

export const readerProfileHighlights = [
  {
    label: "Account type",
    value: "Individual reader",
    detail: "This workspace is for one subscriber account, not a multi-seat company profile.",
  },
  {
    label: "Address role",
    value: "Billing and delivery reference",
    detail: "The saved address supports recurring billing support and shipment routing where print delivery applies.",
  },
  {
    label: "Support model",
    value: "Self-service first",
    detail: "Profile edits, privacy visibility, export, and deletion review all need clear routes inside the account area.",
  },
];

export const readerConsentChecklist = [
  {
    title: "Delivery coordination consent",
    detail: "Address and contact data may be shared with the logistics workflow when physical newspaper delivery is part of the plan.",
  },
  {
    title: "Privacy update visibility",
    detail: "Important account or governance notices should stay visible even when marketing messages are turned off.",
  },
  {
    title: "Newsletter preference",
    detail: "Editorial product updates should be optional and separate from essential billing or privacy communication.",
  },
];

export const readerGovernanceActionNotes = [
  {
    title: "Data export",
    detail: "Use export when you want a copy of the profile, subscription, and delivery-related data attached to your account.",
  },
  {
    title: "Deletion review",
    detail: "Deletion requests may still require retention review when billing, shipment, or legal obligations apply.",
  },
  {
    title: "Retention context",
    detail: "Operational records may outlive marketing preferences, especially where delivery disputes or invoice history are involved.",
  },
];

export const businessPrivacyChecklist = [
  {
    title: "Delivery coordination consent",
    field: "deliveryDataConsent",
    detail: "Receiving contacts, site addresses, and shipment notes may be shared with the logistics workflow when business newspaper distribution is active.",
  },
  {
    title: "Privacy update visibility",
    field: "privacyUpdatesOptIn",
    detail: "Company account owners should keep governance and compliance notices visible even when optional commercial outreach is turned off.",
  },
  {
    title: "Commercial update preference",
    field: "commercialUpdatesOptIn",
    detail: "Pricing, contract, and product updates stay optional and separate from required operational or privacy communication.",
  },
];

export const businessGovernanceActionNotes = [
  {
    title: "Company data export",
    detail: "Use export when you need a packaged copy of organization contacts, location records, shipment context, and invoice-linked account data.",
  },
  {
    title: "Deletion and retention review",
    detail: "Business requests may require staged deletion review when VAT, invoice, shipment, or dispute records still need to be retained.",
  },
  {
    title: "Admin review path",
    detail: "Some requests need operations or admin confirmation so the team can verify authority before changing company-level records.",
  },
];

export const termsHighlights = [
  {
    title: "Subscription billing",
    body: "Individual reader subscriptions are offered on monthly or yearly billing cycles. Business accounts may instead use negotiated or invoice-based billing arrangements.",
  },
  {
    title: "Delivery cadence",
    body: "Billing frequency does not control newspaper arrival frequency. Active print subscribers follow the fixed two-week delivery cadence described in the product proposal.",
  },
  {
    title: "Access timing",
    body: "Recent articles are reserved for active subscribers, while public readers gain access once the content moves beyond the 30-day delay window.",
  },
  {
    title: "Account responsibilities",
    body: "Subscribers are responsible for keeping contact and delivery details accurate so billing and shipment routing can function correctly.",
  },
  {
    title: "Business orders and pricing",
    body: "Business ordering may involve bulk copy counts, separate invoice handling, and volume-based pricing rules that differ from individual reader plans.",
  },
  {
    title: "Content use",
    body: "Editorial content remains protected by copyright and may not be reproduced or redistributed commercially without permission.",
  },
];

export const policyContacts = {
  privacyEmail: "privacy@newsletter.local",
  supportEmail: "support@newsletter.local",
  billingEmail: "billing@newsletter.local",
};

const MONTH_INDEX = {
  January: 0,
  February: 1,
  March: 2,
  April: 3,
  May: 4,
  June: 5,
  July: 6,
  August: 7,
  September: 8,
  October: 9,
  November: 10,
  December: 11,
};

const ACCESS_REFERENCE_DATE = new Date(Date.UTC(2026, 7, 10));

export function parseArticleDate(dateLabel) {
  if (!dateLabel) {
    return null;
  }

  const [monthName, dayLabel, yearLabel] = dateLabel.replace(",", "").split(" ");
  const month = MONTH_INDEX[monthName];
  const day = Number(dayLabel);
  const year = Number(yearLabel);

  if (Number.isNaN(day) || Number.isNaN(year) || month === undefined) {
    return null;
  }

  return new Date(Date.UTC(year, month, day));
}

function addDays(date, days) {
  const next = new Date(date);
  next.setUTCDate(next.getUTCDate() + days);
  return next;
}

function formatArticleDate(date) {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function getArticleAccessState(article, hasSubscriberAccess = false) {
  const publishedAt = parseArticleDate(article?.date);
  const derivedPublicAccessAt = publishedAt ? addDays(publishedAt, 30) : null;
  const publicAccessAt = article?.publicAccessDate
    ? parseArticleDate(article.publicAccessDate)
    : derivedPublicAccessAt;
  const isArchiveOpen =
    publicAccessAt instanceof Date &&
    !Number.isNaN(publicAccessAt.getTime()) &&
    publicAccessAt <= ACCESS_REFERENCE_DATE;

  if (hasSubscriberAccess) {
    return {
      key: "subscriber",
      label: "Subscriber access active",
      shortLabel: "Subscriber access",
      detail: publicAccessAt
        ? `Full article access is active. Public archive opens on ${formatArticleDate(publicAccessAt)}.`
        : "Full article access is active for signed-in readers.",
      publicAccessDate: publicAccessAt ? formatArticleDate(publicAccessAt) : null,
      canReadFull: true,
      isLocked: false,
      isArchiveOpen,
    };
  }

  if (isArchiveOpen) {
    return {
      key: "public",
      label: "Public archive access",
      shortLabel: "Public archive",
      detail: "This story is now open to all readers because the 30-day access window has passed.",
      publicAccessDate: publicAccessAt ? formatArticleDate(publicAccessAt) : null,
      canReadFull: true,
      isLocked: false,
      isArchiveOpen: true,
    };
  }

  return {
    key: "locked",
    label: "Recent subscriber-only story",
    shortLabel: publicAccessAt
      ? `Opens publicly ${formatArticleDate(publicAccessAt)}`
      : "Subscriber-only access",
    detail: publicAccessAt
      ? `This reporting stays reserved for active subscribers until ${formatArticleDate(publicAccessAt)}.`
      : "This reporting stays reserved for active subscribers during the recent-access window.",
    publicAccessDate: publicAccessAt ? formatArticleDate(publicAccessAt) : null,
    canReadFull: false,
    isLocked: true,
    isArchiveOpen: false,
  };
}
