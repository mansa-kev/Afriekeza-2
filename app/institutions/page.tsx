import { Building2, Shield, Scale, Globe, Rocket, Landmark, FileSearch, Database, BarChart3, Handshake } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { SectionHeader } from "@/components/section-header";
import { PartnerForm } from "@/components/partner-form";

const partners = [
  { id: "banks", icon: Building2, title: "Banks", desc: "Expand private-market origination and structured credit distribution through trusted infrastructure." },
  { id: "custodians", icon: Shield, title: "Custodians & Trustees", desc: "Support asset custody, administration, and investor protection for private-market instruments." },
  { id: "law-firms", icon: Scale, title: "Law Firms", desc: "Advise on structured capital transactions, governance, and regulatory compliance." },
  { id: "dfis", icon: Landmark, title: "DFIs & Impact Investors", desc: "Channel development and impact capital to vetted African growth businesses." },
  { id: "diaspora", icon: Globe, title: "Diaspora Groups", desc: "Connect global African investors to structured, risk-rated opportunities at home." },
  { id: "accelerators", icon: Rocket, title: "Accelerators", desc: "Prepare portfolio companies for capital readiness, documentation, and investor reporting." },
];

const infrastructure = [
  { id: "origination", icon: FileSearch, title: "Private Credit Origination", desc: "Pipeline infrastructure for sourcing, reviewing, and structuring private credit opportunities." },
  { id: "registry", icon: Database, title: "Issuer Registry", desc: "Ownership records, cap tables, and compliance documentation for growing companies." },
  { id: "reporting", icon: BarChart3, title: "Investor Reporting", desc: "Post-investment transparency tools for structured updates and use-of-funds tracking." },
  { id: "due-diligence", icon: FileSearch, title: "Due Diligence Data", desc: "Standardized issuer information for faster, more consistent review processes." },
  { id: "regulatory", icon: Scale, title: "Regulatory Collaboration", desc: "Working with regulators to build responsible private-market infrastructure." },
];

export default function InstitutionsPage() {
  return (
    <>
      <PageHero
        headline="Partner with Afriekeza to build Africa's private-market infrastructure."
        subheadline="We work with financial institutions, custodians, trustees, advisors, DFIs, accelerators, and diaspora groups to expand responsible capital access."
      />

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeader headline="Partner types" />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {partners.map((item) => (
              <div key={item.id} id={item.id} className="rounded-3xl border border-soft-border bg-white p-7 transition-all hover:-translate-y-1 hover:shadow-lg">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-soft-blue text-blue">
                  <item.icon className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold text-dark">{item.title}</h3>
                <p className="mt-2 text-[15px] text-muted">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-off-white py-20">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeader headline="Infrastructure use cases" />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {infrastructure.map((item) => (
              <div key={item.id} id={item.id} className="rounded-3xl border border-soft-border bg-white p-7">
                <item.icon className="h-6 w-6 text-green" />
                <h3 className="mt-4 text-lg font-semibold text-dark">{item.title}</h3>
                <p className="mt-2 text-[15px] text-muted">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeader headline="Why partner with Afriekeza" />
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {[
              { title: "African-first infrastructure", desc: "Built for the realities of African SME finance, governance, and investor needs." },
              { title: "Compliance-aware design", desc: "Structured for responsible private-market access with clear disclosures and reporting." },
              { title: "Scalable platform", desc: "Registry, origination, and reporting tools that grow with the market." },
            ].map((item) => (
              <div key={item.title} className="rounded-3xl border border-soft-border bg-white p-7 text-center">
                <Handshake className="mx-auto h-8 w-8 text-blue" />
                <h3 className="mt-4 text-lg font-semibold text-dark">{item.title}</h3>
                <p className="mt-2 text-[15px] text-muted">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="partner" className="bg-off-white py-20">
        <div className="mx-auto max-w-3xl px-6">
          <SectionHeader headline="Partner enquiry" subheadline="Tell us about your organization and how you'd like to collaborate." />
          <PartnerForm className="mt-10" />
        </div>
      </section>
    </>
  );
}
