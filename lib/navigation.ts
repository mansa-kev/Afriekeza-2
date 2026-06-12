export type NavItem = {
  title: string;
  description: string;
  href: string;
};

export type NavColumn = {
  title: string;
  items: NavItem[];
};

export type NavSection = {
  label: string;
  href: string;
  columns: NavColumn[];
};

export const mainNav: NavSection[] = [
  {
    label: "Invest",
    href: "/invest",
    columns: [
      {
        title: "BROWSE OPPORTUNITIES",
        items: [
          {
            title: "All Opportunities",
            description: "Private markets and structured opportunities.",
            href: "/invest",
          },
          {
            title: "Afriekeza Yield",
            description: "Private credit for vetted businesses.",
            href: "/invest#yield",
          },
          {
            title: "Revenue-Backed Notes",
            description: "Opportunities linked to business revenue.",
            href: "/invest#revenue-backed",
          },
          {
            title: "Asset-Backed Notes",
            description: "Opportunities supported by business assets.",
            href: "/invest#asset-backed",
          },
          {
            title: "Growth Notes",
            description: "Short-to-medium-term growth capital.",
            href: "/invest#growth-notes",
          },
          {
            title: "Future Equity Opportunities",
            description: "Convertible and equity pathways.",
            href: "/invest#equity",
          },
        ],
      },
      {
        title: "FIRST-TIME INVESTORS",
        items: [
          {
            title: "Why Private Markets",
            description: "Understand why private markets matter.",
            href: "/learn#private-markets",
          },
          {
            title: "How Afriekeza Works",
            description: "Your guide to responsible participation.",
            href: "/#how-it-works",
          },
          {
            title: "Understanding Risk",
            description: "Learn risk labels and capital-at-risk.",
            href: "/learn#risk",
          },
          {
            title: "What You Own",
            description: "Know your rights before investing.",
            href: "/invest#what-you-own",
          },
          {
            title: "Investor FAQs",
            description: "Common questions answered simply.",
            href: "/invest#faqs",
          },
        ],
      },
    ],
  },
  {
    label: "Raise",
    href: "/raise",
    columns: [
      {
        title: "FOR BUSINESSES",
        items: [
          {
            title: "Apply to Raise",
            description: "Submit your company for review.",
            href: "/raise#apply",
          },
          {
            title: "Afriekeza Yield for Businesses",
            description: "Raise structured private credit.",
            href: "/raise#yield",
          },
          {
            title: "Afriekeza Raise",
            description: "Prepare for convertible and equity capital.",
            href: "/raise",
          },
          {
            title: "Funding Readiness",
            description: "See what investors expect.",
            href: "/raise#readiness",
          },
          {
            title: "Issuer Requirements",
            description: "Documents, governance, and reporting.",
            href: "/raise#requirements",
          },
        ],
      },
      {
        title: "AFTER FUNDING",
        items: [
          {
            title: "Investor Reporting",
            description: "Keep investors updated.",
            href: "/raise#reporting",
          },
          {
            title: "Use of Funds Tracking",
            description: "Show how capital is deployed.",
            href: "/raise#use-of-funds",
          },
          {
            title: "Business Transparency",
            description: "Build trust after raising.",
            href: "/raise#transparency",
          },
          {
            title: "Issuer FAQs",
            description: "Questions from founders and finance teams.",
            href: "/raise#faqs",
          },
        ],
      },
    ],
  },
  {
    label: "Registry",
    href: "/registry",
    columns: [
      {
        title: "REGISTRY TOOLS",
        items: [
          {
            title: "Cap Table Management",
            description: "Know who owns what.",
            href: "/registry#cap-table",
          },
          {
            title: "Investor Updates",
            description: "Send structured reports.",
            href: "/registry#updates",
          },
          {
            title: "Data Room",
            description: "Organize documents securely.",
            href: "/registry#data-room",
          },
          {
            title: "ESOP Management",
            description: "Manage employee ownership.",
            href: "/registry#esop",
          },
          {
            title: "Compliance Documents",
            description: "Keep ownership records clean.",
            href: "/registry#compliance",
          },
        ],
      },
      {
        title: "USE CASES",
        items: [
          {
            title: "For Startups",
            description: "Prepare before raising.",
            href: "/registry#startups",
          },
          {
            title: "For SMEs",
            description: "Organize financial and investor records.",
            href: "/registry#smes",
          },
          {
            title: "For Founders",
            description: "Understand dilution and ownership.",
            href: "/registry#founders",
          },
          {
            title: "For Advisors",
            description: "Support clients with better reporting.",
            href: "/registry#advisors",
          },
        ],
      },
    ],
  },
  {
    label: "Learn",
    href: "/learn",
    columns: [
      {
        title: "PRIVATE MARKETS 101",
        items: [
          {
            title: "What Are Private Markets?",
            description: "Growth opportunities outside public exchanges.",
            href: "/learn#private-markets",
          },
          {
            title: "What Is Private Credit?",
            description: "Structured lending to growing businesses.",
            href: "/learn#private-credit",
          },
          {
            title: "What Is Tokenization?",
            description: "Digital representation of ownership rights.",
            href: "/learn#tokenization",
          },
          {
            title: "What Is a Revenue-Backed Note?",
            description: "Notes linked to business revenue streams.",
            href: "/learn#revenue-backed",
          },
          {
            title: "What Does Capital at Risk Mean?",
            description: "Understanding potential loss of capital.",
            href: "/learn#capital-at-risk",
          },
        ],
      },
      {
        title: "GUIDES",
        items: [
          {
            title: "Beginner Investor Guide",
            description: "Start your private-market journey.",
            href: "/learn#beginner-guide",
          },
          {
            title: "Business Funding Guide",
            description: "Prepare your company to raise capital.",
            href: "/learn#business-guide",
          },
          {
            title: "Risk Label Guide",
            description: "How Afriekeza rates opportunity risk.",
            href: "/learn#risk-labels",
          },
          {
            title: "Afriekeza Glossary",
            description: "Key terms explained simply.",
            href: "/learn#glossary",
          },
          {
            title: "Articles & Insights",
            description: "Perspectives on African private markets.",
            href: "/learn#articles",
          },
        ],
      },
    ],
  },
  {
    label: "Institutions",
    href: "/institutions",
    columns: [
      {
        title: "PARTNERS",
        items: [
          {
            title: "Banks",
            description: "Expand private-market origination.",
            href: "/institutions#banks",
          },
          {
            title: "Custodians & Trustees",
            description: "Support asset custody and administration.",
            href: "/institutions#custodians",
          },
          {
            title: "Law Firms",
            description: "Advise on structured capital transactions.",
            href: "/institutions#law-firms",
          },
          {
            title: "DFIs & Impact Investors",
            description: "Channel capital to African growth.",
            href: "/institutions#dfis",
          },
          {
            title: "Diaspora Groups",
            description: "Connect global African investors.",
            href: "/institutions#diaspora",
          },
          {
            title: "Accelerators",
            description: "Prepare portfolio companies for capital.",
            href: "/institutions#accelerators",
          },
        ],
      },
      {
        title: "INFRASTRUCTURE",
        items: [
          {
            title: "Private Credit Origination",
            description: "Structured credit pipeline infrastructure.",
            href: "/institutions#origination",
          },
          {
            title: "Issuer Registry",
            description: "Ownership and compliance records.",
            href: "/institutions#registry",
          },
          {
            title: "Investor Reporting",
            description: "Post-investment transparency tools.",
            href: "/institutions#reporting",
          },
          {
            title: "Due Diligence Data",
            description: "Standardized issuer information.",
            href: "/institutions#due-diligence",
          },
          {
            title: "Regulatory Collaboration",
            description: "Responsible market development.",
            href: "/institutions#regulatory",
          },
          {
            title: "Partner With Us",
            description: "Explore institutional partnerships.",
            href: "/institutions#partner",
          },
        ],
      },
    ],
  },
  {
    label: "About",
    href: "/about",
    columns: [
      {
        title: "ABOUT AFRIEKEZA",
        items: [
          {
            title: "Inside Afriekeza",
            description: "Our story, purpose, and model.",
            href: "/about",
          },
          {
            title: "Mission & Vision",
            description: "Why we are building this.",
            href: "/about#mission",
          },
          {
            title: "Trust & Safety",
            description: "Our approach to investor protection.",
            href: "/trust-safety",
          },
          {
            title: "Newsroom",
            description: "Company updates.",
            href: "/about#newsroom",
          },
          {
            title: "Contact Us",
            description: "Connect with our team.",
            href: "/contact",
          },
          {
            title: "FAQs",
            description: "Common questions.",
            href: "/about#faqs",
          },
        ],
      },
      {
        title: "COMPANY",
        items: [
          {
            title: "Careers",
            description: "Join our team.",
            href: "/about#careers",
          },
          {
            title: "Advisors",
            description: "Leaders guiding our mission.",
            href: "/about#advisors",
          },
          {
            title: "Legal & Disclosures",
            description: "Important legal information.",
            href: "/about#legal",
          },
        ],
      },
    ],
  },
];

export const footerLinks = {
  afriekeza: [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Trust & Safety", href: "/trust-safety" },
    { label: "Contact", href: "/contact" },
  ],
  invest: [
    { label: "Afriekeza Yield", href: "/invest#yield" },
    { label: "Why Private Markets", href: "/learn#private-markets" },
    { label: "Understanding Risk", href: "/learn#risk" },
    { label: "Investor FAQs", href: "/invest#faqs" },
  ],
  raise: [
    { label: "Apply to Raise", href: "/raise#apply" },
    { label: "Funding Readiness", href: "/raise#readiness" },
    { label: "Issuer Requirements", href: "/raise#requirements" },
  ],
  registry: [
    { label: "Registry", href: "/registry" },
    { label: "Institutions", href: "/institutions" },
  ],
  institutions: [
    { label: "Banks", href: "/institutions#banks" },
    { label: "Custodians & Trustees", href: "/institutions#custodians" },
    { label: "DFIs & Impact Investors", href: "/institutions#dfis" },
    { label: "Partner With Us", href: "/institutions#partner" },
  ],
};
