export type ReadinessCategory =
  | "legal"
  | "financial"
  | "governance"
  | "operational"
  | "reporting"
  | "investor_materials";

export type ChecklistTemplateItem = {
  category: ReadinessCategory;
  title: string;
  description: string;
  weight: number;
  required: boolean;
};

export const DEFAULT_READINESS_CHECKLIST: ChecklistTemplateItem[] = [
  {
    category: "legal",
    title: "Certificate of incorporation",
    description: "Upload current company registration certificate.",
    weight: 10,
    required: true,
  },
  {
    category: "legal",
    title: "KRA PIN certificate",
    description: "Valid tax registration document.",
    weight: 8,
    required: true,
  },
  {
    category: "legal",
    title: "Memorandum & articles / constitution",
    description: "Governing documents for the entity.",
    weight: 8,
    required: true,
  },
  {
    category: "governance",
    title: "Director register",
    description: "Complete director details in company profile.",
    weight: 8,
    required: true,
  },
  {
    category: "governance",
    title: "Beneficial ownership disclosure",
    description: "Ultimate beneficial owners recorded and verified.",
    weight: 10,
    required: true,
  },
  {
    category: "governance",
    title: "Board resolution authorizing raise",
    description: "Resolution approving capital raise or credit facility.",
    weight: 6,
    required: false,
  },
  {
    category: "financial",
    title: "Latest audited or management accounts",
    description: "Most recent 12-month financial statements.",
    weight: 12,
    required: true,
  },
  {
    category: "financial",
    title: "12-month bank statements",
    description: "Complete bank statements for primary operating account.",
    weight: 10,
    required: true,
  },
  {
    category: "financial",
    title: "Revenue evidence",
    description: "Invoices, contracts, or M-Pesa summaries supporting revenue.",
    weight: 8,
    required: true,
  },
  {
    category: "operational",
    title: "Business profile completeness",
    description: "Legal name, sector, revenue model, and operations documented.",
    weight: 6,
    required: true,
  },
  {
    category: "operational",
    title: "Use of funds plan",
    description: "Clear allocation of requested capital by category.",
    weight: 8,
    required: true,
  },
  {
    category: "reporting",
    title: "Investor update template configured",
    description: "At least one investor report draft or template started.",
    weight: 5,
    required: false,
  },
  {
    category: "reporting",
    title: "Reporting calendar acknowledged",
    description: "Upcoming reporting obligations reviewed.",
    weight: 4,
    required: false,
  },
  {
    category: "investor_materials",
    title: "Cap table recorded",
    description: "Founders and shareholders entered with ownership percentages.",
    weight: 10,
    required: true,
  },
  {
    category: "investor_materials",
    title: "Pitch deck or investment memo",
    description: "Investor-facing summary uploaded to data room.",
    weight: 6,
    required: false,
  },
];

export const DATA_ROOM_FOLDER_TYPES = [
  { folder_type: "registration", label: "Company registration" },
  { folder_type: "tax", label: "Tax documents" },
  { folder_type: "financials", label: "Financial statements" },
  { folder_type: "banking", label: "Bank statements" },
  { folder_type: "contracts", label: "Contracts" },
  { folder_type: "governance", label: "Board & shareholder documents" },
  { folder_type: "pitch", label: "Pitch deck & investor materials" },
  { folder_type: "legal", label: "Legal agreements" },
] as const;
