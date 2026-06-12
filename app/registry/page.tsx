import { PieChart, FolderOpen, FileText, Users, ClipboardList } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { SectionHeader } from "@/components/section-header";
import { Button } from "@/components/ui/button";

const features = [
  { id: "cap-table", icon: PieChart, title: "Cap Table Management", desc: "Maintain a clear record of who owns what. Track shares, options, and dilution across funding rounds." },
  { id: "data-room", icon: FolderOpen, title: "Data Room", desc: "Organize financial, legal, and governance documents in a secure, structured environment." },
  { id: "updates", icon: FileText, title: "Investor Updates", desc: "Send structured reports to investors with consistent formats and delivery schedules." },
  { id: "esop", icon: Users, title: "ESOP Management", desc: "Manage employee stock option plans, vesting schedules, and ownership allocations." },
  { id: "compliance", icon: ClipboardList, title: "Compliance Documents", desc: "Keep ownership records, resolutions, and regulatory filings organized and accessible." },
];

const useCases = [
  { id: "startups", title: "For Startups", desc: "Set up your cap table and data room before your first raise." },
  { id: "smes", title: "For SMEs", desc: "Organize financial and investor records as you scale." },
  { id: "founders", title: "For Founders", desc: "Understand dilution, ownership, and investor rights." },
  { id: "advisors", title: "For Advisors", desc: "Support clients with better reporting and documentation." },
];

export default function RegistryPage() {
  return (
    <>
      <PageHero
        headline="Cap tables, investor updates, and reporting made simple."
        subheadline="Afriekeza Registry helps growing companies organize ownership, documents, ESOPs, and investor communication."
      />

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {features.map((feature, i) => (
              <div key={feature.id} id={feature.id} className="rounded-3xl border border-soft-border bg-white p-8 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-soft-blue text-blue">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold text-dark">{feature.title}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-muted">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-off-white py-20">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeader headline="Use cases" />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {useCases.map((item) => (
              <div key={item.id} id={item.id} className="rounded-3xl border border-soft-border bg-white p-6">
                <h4 className="font-semibold text-dark">{item.title}</h4>
                <p className="mt-2 text-sm text-muted">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <SectionHeader headline="Request registry access" subheadline="Get early access to Afriekeza Registry for your company." />
          <Button href="/contact" variant="primary" size="lg" className="mt-8">
            Request Registry Access
          </Button>
        </div>
      </section>
    </>
  );
}
