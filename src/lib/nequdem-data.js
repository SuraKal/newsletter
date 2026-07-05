// Nequdem Demo Data
export const IMAGES = {
  hero: "https://media.base44.com/images/public/6a4a0d6edcbfa94e7556ac31/8375b41ca_generated_78414a30.png",
  politics:
    "https://media.base44.com/images/public/6a4a0d6edcbfa94e7556ac31/9ccd5257b_generated_4058acd7.png",
  business:
    "https://media.base44.com/images/public/6a4a0d6edcbfa94e7556ac31/bd5ad771d_generated_a72f866f.png",
  sports:
    "https://media.base44.com/images/public/6a4a0d6edcbfa94e7556ac31/98a51142d_generated_c97bf4b0.png",
  technology:
    "https://media.base44.com/images/public/6a4a0d6edcbfa94e7556ac31/f154e3a08_generated_c0e75569.png",
  culture:
    "https://media.base44.com/images/public/6a4a0d6edcbfa94e7556ac31/4f9bff567_generated_efaa1902.png",
  economy:
    "https://media.base44.com/images/public/6a4a0d6edcbfa94e7556ac31/8e2eb7b15_generated_a035c31e.png",
  featured:
    "https://media.base44.com/images/public/6a4a0d6edcbfa94e7556ac31/51e8026af_generated_2c40c7b6.png",
  printing:
    "https://media.base44.com/images/public/6a4a0d6edcbfa94e7556ac31/55579c526_generated_1e515f46.png",
  mobile:
    "https://media.base44.com/images/public/6a4a0d6edcbfa94e7556ac31/6f813c169_generated_8e3d2348.png",
  testimonial1:
    "https://media.base44.com/images/public/6a4a0d6edcbfa94e7556ac31/43e7824e9_generated_72d6fcca.png",
  testimonial2:
    "https://media.base44.com/images/public/6a4a0d6edcbfa94e7556ac31/f39a4bf67_generated_4ebecf8c.png",
  testimonial3:
    "https://media.base44.com/images/public/6a4a0d6edcbfa94e7556ac31/bac1fc311_generated_15609f5b.png",
  world:
    "https://media.base44.com/images/public/6a4a0d6edcbfa94e7556ac31/3b7adf06b_generated_79e61bfd.png",
  events:
    "https://media.base44.com/images/public/6a4a0d6edcbfa94e7556ac31/42a4a698a_generated_769d8e09.png",
  about:
    "https://media.base44.com/images/public/6a4a0d6edcbfa94e7556ac31/8a955c7a2_generated_b2ac0fc6.png",
  businessSection:
    "https://media.base44.com/images/public/6a4a0d6edcbfa94e7556ac31/a9ed45bb7_generated_9b7325b3.png",
  delivery:
    "https://media.base44.com/images/public/6a4a0d6edcbfa94e7556ac31/068abca60_generated_c14ae7fc.png",
};

export const CATEGORIES = [
  { name: "Politics", slug: "politics", image: "politics" },
  { name: "Business", slug: "business", image: "business" },
  { name: "Economy", slug: "economy", image: "economy" },
  { name: "Technology", slug: "technology", image: "technology" },
  { name: "Sports", slug: "sports", image: "sports" },
  { name: "Culture", slug: "culture", image: "culture" },
  { name: "Events", slug: "events", image: "events" },
  { name: "World", slug: "world", image: "world" },
];

export const ARTICLES = [
  {
    id: "1",
    title:
      "Global Summit Reaches Historic Agreement on Climate Finance for Developing Nations",
    deck: "World leaders commit to unprecedented $300 billion annual fund, marking a turning point in international climate diplomacy after years of deadlock.",
    category: "Politics",
    author: "Eleanor Ashford",
    date: "July 5, 2026",
    readTime: "8 min read",
    image: "hero",
    body: `The international community has reached what many are calling the most significant climate agreement since the Paris Accords. After twelve days of intense negotiations in Geneva, representatives from 194 nations have committed to a $300 billion annual climate finance mechanism designed to support the most vulnerable developing nations in their transition to renewable energy.\n\nThe agreement, formally titled the Geneva Climate Finance Compact, establishes a binding framework that requires industrialized nations to contribute based on both their historical emissions and current GDP. This marks the first time that climate reparations have been formally acknowledged in an international treaty.\n\n"This is not charity," said Ambassador Maria Santos of Brazil, who served as the chief negotiator for the G77 bloc. "This is recognition that the nations most affected by climate change are the ones who contributed least to causing it."\n\nThe compact includes provisions for transparent fund allocation, with an independent oversight body comprised of climate scientists, economists, and civil society representatives from both donor and recipient nations. The first disbursements are expected to begin in early 2027.\n\nCritics from several industrialized nations have raised concerns about the binding nature of the contributions, arguing that domestic economic pressures should be considered. However, proponents point to economic modeling suggesting that the cost of inaction far exceeds the investment required.\n\nThe agreement also introduces a novel "loss and damage" mechanism that provides immediate financial relief to nations experiencing climate-related disasters, a provision that was notably absent from previous international frameworks.`,
    featured: true,
  },
  {
    id: "2",
    title:
      "Central Banks Signal Coordinated Rate Adjustment as Global Inflation Stabilizes",
    deck: "Federal Reserve, ECB, and Bank of England prepare synchronized policy shift amid strongest economic indicators in three years.",
    category: "Economy",
    author: "Marcus Webb",
    date: "July 5, 2026",
    readTime: "6 min read",
    image: "economy",
  },
  {
    id: "3",
    title:
      "Tech Giants Face Unprecedented Antitrust Action Across Three Continents",
    deck: "Coordinated regulatory push targets market dominance of major technology platforms in the most aggressive enforcement effort to date.",
    category: "Technology",
    author: "Sarah Chen",
    date: "July 4, 2026",
    readTime: "7 min read",
    image: "technology",
  },
  {
    id: "4",
    title: "Premier League Transfer Window Opens With Record-Breaking Deals",
    deck: "Three clubs shatter spending records in the first 48 hours as football's financial landscape continues to transform.",
    category: "Sports",
    author: "James Whitfield",
    date: "July 4, 2026",
    readTime: "5 min read",
    image: "sports",
  },
  {
    id: "5",
    title: "Venice Biennale Opens With Powerful Statement on Digital Identity",
    deck: "This year's exhibition challenges visitors to confront the boundaries between authentic and constructed selfhood in the age of AI.",
    category: "Culture",
    author: "Isabella Moretti",
    date: "July 3, 2026",
    readTime: "9 min read",
    image: "culture",
  },
  {
    id: "6",
    title:
      "Diplomatic Tensions Rise as Trade Negotiations Reach Critical Phase",
    deck: "Senior officials from both sides acknowledge that the next 72 hours will determine the future of the bilateral economic relationship.",
    category: "World",
    author: "Robert Blackwood",
    date: "July 3, 2026",
    readTime: "6 min read",
    image: "world",
  },
  {
    id: "7",
    title: "New Parliament Building Inaugurated in Historic Ceremony",
    deck: "The architectural landmark signals a new era for democratic governance while honoring centuries of legislative tradition.",
    category: "Politics",
    author: "David Thornton",
    date: "July 3, 2026",
    readTime: "4 min read",
    image: "politics",
  },
  {
    id: "8",
    title: "Multinational Corporations Report Strongest Quarter in Five Years",
    deck: "Earnings season reveals surprising resilience across sectors, driven by emerging market growth and operational efficiency gains.",
    category: "Business",
    author: "Catherine Price",
    date: "July 2, 2026",
    readTime: "5 min read",
    image: "business",
  },
  {
    id: "9",
    title:
      "International Arts Festival Draws Record Attendance Amid Cultural Renaissance",
    deck: "Over two million visitors converge for the most ambitious celebration of global arts and music in the festival's 40-year history.",
    category: "Events",
    author: "Amara Okafor",
    date: "July 2, 2026",
    readTime: "6 min read",
    image: "events",
  },
];

export const TRENDING_HEADLINES = [
  "Supreme Court Issues Landmark Ruling on Digital Privacy Rights",
  "Oil Prices Surge Amid Middle East Supply Disruptions",
  "Breakthrough in Quantum Computing Achieved by European Research Team",
  "Historic Peace Accord Signed After Decade of Negotiations",
  "Major Airline Announces Sustainable Aviation Fuel Partnership",
];

export const TICKER_ITEMS = [
  "London Edition: Delivered",
  "New York Edition: In Transit",
  "Tokyo Edition: Off the Press",
  "Paris Edition: Delivered",
  "Dubai Edition: In Transit",
  "Sydney Edition: Delivered",
  "Berlin Edition: Off the Press",
];

export const TESTIMONIALS = [
  {
    name: "Sir Richard Pemberton",
    role: "Chairman, Pemberton Capital",
    image: "testimonial1",
    quote:
      "Nequdem has become indispensable to my morning routine. The depth of analysis and editorial integrity is unmatched. Receiving the physical edition at my desk is a ritual I refuse to abandon.",
  },
  {
    name: "Dr. Helena Vasquez",
    role: "Director, Institute for Policy Research",
    image: "testimonial2",
    quote:
      "In an era of information overload, Nequdem cuts through the noise with reporting that is both rigorous and accessible. Their coverage of international affairs is simply the finest available.",
  },
  {
    name: "Thomas Eriksen",
    role: "Managing Partner, Nordic Ventures",
    image: "testimonial3",
    quote:
      "We subscribe to Nequdem for our entire executive team. The business intelligence and economic analysis have directly influenced several strategic decisions. It is an investment, not an expense.",
  },
];

export const SUBSCRIPTION_PLANS = [
  {
    name: "Digital Standard",
    price: "$14.99",
    period: "per month",
    features: [
      "Unlimited digital access",
      "Daily newsletter",
      "Mobile app access",
      "Article archive (5 years)",
      "Breaking news alerts",
    ],
  },
  {
    name: "Print + Digital",
    price: "$39.99",
    period: "per month",
    badge: "Most Distinguished",
    featured: true,
    features: [
      "Everything in Digital Standard",
      "Physical newspaper every two weeks",
      "Premium member-only articles",
      "Live delivery tracking",
      "Exclusive editorial events",
      "Ad-free reading experience",
    ],
  },
  {
    name: "Business Ledger",
    price: "$89.99",
    period: "per month",
    features: [
      "Everything in Print + Digital",
      "Up to 25 team members",
      "Bulk newspaper delivery",
      "Company dashboard",
      "Volume pricing discounts",
      "Consolidated billing",
      "Dedicated account manager",
    ],
  },
];
