import { IMAGES } from "@/lib/constants";

export const heroArticle = {
  id: "hero-1",
  image: IMAGES.hero,
  category: "World",
  date: "July 4, 2026",
  headline:
    "Global Leaders Convene for Historic Climate Accord as Nations Pledge Carbon Neutrality by 2040",
  summary:
    "In a landmark summit that drew representatives from over 140 nations, world leaders signed an unprecedented agreement committing to aggressive carbon reduction targets. The accord, negotiated over four intense days in Geneva, represents the most ambitious climate framework since the Paris Agreement.",
  author: "Sarah Whitfield",
  readTime: "8 min read",
};

export const sidebarArticles = [
  {
    id: "side-1",
    image: IMAGES.politics,
    category: "Politics",
    date: "July 4, 2026",
    headline:
      "Senate Approves Sweeping Infrastructure Bill After Months of Bipartisan Negotiations",
    summary:
      "The $2.3 trillion package includes funding for roads, bridges, broadband, and clean energy initiatives.",
  },
  {
    id: "side-2",
    image: IMAGES.business,
    category: "Business",
    date: "July 3, 2026",
    headline:
      "Major Tech Firms Report Record Quarterly Earnings Amid AI Investment Surge",
    summary:
      "Silicon Valley's largest companies exceeded analyst expectations.",
  },
  {
    id: "side-3",
    image: null,
    category: "Economy",
    date: "July 3, 2026",
    headline:
      "Central Banks Signal Coordinated Interest Rate Strategy for Second Half",
    summary: "",
  },
  {
    id: "side-4",
    image: null,
    category: "World",
    date: "July 2, 2026",
    headline:
      "Historic Peace Agreement Reached in East African Territorial Dispute",
    summary: "",
  },
];

export const rightColumnArticle = {
  id: "right-1",
  image: IMAGES.economy,
  category: "Opinion",
  date: "July 4, 2026",
  headline: "The Future of Global Trade Demands a New Kind of Diplomacy",
  summary:
    "Our veteran correspondent examines how shifting alliances are reshaping the economic landscape.",
  author: "Dr. Martin Caldwell",
};

export const latestNews = [
  {
    id: "ln-1",
    image: IMAGES.politics,
    category: "Politics",
    date: "July 4, 2026",
    headline:
      "Electoral Reform Commission Publishes Final Recommendations After Year-Long Study",
    summary:
      "The independent body calls for modernized voting systems, expanded early voting, and enhanced transparency measures across federal elections.",
    author: "James Harrington",
  },
  {
    id: "ln-2",
    image: IMAGES.sports,
    category: "Sports",
    date: "July 3, 2026",
    headline:
      "Olympic Committee Unveils Host City Selection for 2036 Summer Games",
    summary:
      "After a competitive bidding process, the committee announced that five finalist cities will present their final proposals next month.",
    author: "Maria Santos",
  },
  {
    id: "ln-3",
    image: IMAGES.business,
    category: "Business",
    date: "July 3, 2026",
    headline:
      "Global Supply Chain Transformation Accelerates Under New Trade Agreements",
    summary:
      "Manufacturing hubs shift as companies restructure operations to meet sustainability requirements and reduce geopolitical risk.",
    author: "Thomas Chen",
  },
  {
    id: "ln-4",
    image: IMAGES.technology,
    category: "Technology",
    date: "July 2, 2026",
    headline:
      "Quantum Computing Breakthrough Promises Revolution in Drug Discovery Timeline",
    summary:
      "Researchers demonstrate a quantum advantage in molecular simulation, potentially reducing pharmaceutical development cycles by years.",
    author: "Dr. Emily Rossini",
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
  business: [
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
    name: "Digital",
    price: "9.99",
    period: "/month",
    description: "Unlimited digital access",
    features: [
      "Unlimited article access",
      "Daily digital edition",
      "Breaking news alerts",
      "Archive access (10 years)",
      "Mobile & tablet apps",
      "Newsletter selection",
    ],
    highlighted: false,
  },
  {
    name: "Print + Digital",
    price: "24.99",
    period: "/month",
    description: "The complete ንቐደም experience",
    features: [
      "Everything in Digital",
      "Physical newspaper every two weeks",
      "Premium long-form content",
      "Member-only articles",
      "Exclusive subscriber events",
      "Real-time delivery tracking",
      "Full archive access",
    ],
    highlighted: true,
  },
  {
    name: "Business",
    price: "89.99",
    period: "/month",
    description: "For teams and organizations",
    features: [
      "Everything in Print + Digital",
      "Up to 25 team members",
      "Bulk newspaper orders",
      "Company dashboard",
      "Consolidated billing",
      "Volume pricing",
      "Dedicated account manager",
      "API access",
    ],
    highlighted: false,
  },
];
