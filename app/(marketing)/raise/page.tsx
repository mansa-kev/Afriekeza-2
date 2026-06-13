import { CheckCircle2, ClipboardList, FileText, Users, BarChart3 } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { SectionHeader } from "@/components/section-header";
import { BusinessApplicationForm } from "@/components/business-application-form";

export default function RaisePage() {
  return (
    <>
      <PageHero
        headline="Raise structured capital from verified investors."
        subheadline="Afriekeza helps credible African businesses prepare, structure, raise, and report with clarity."
      />

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeader headline="Who should apply" subheadline="Afriekeza works with growth-stage African businesses ready for structured capital." />
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {[
              { title: "Growth-stage SMEs", desc: "Companies with revenue, operations, and a clear growth plan seeking structured capital." },
              { title: "Bankable but underserved", desc: "Businesses too mature for grants but not yet suited for traditional bank or public market financing." },
              { title: "Documentation-ready", desc: "Founders willing to organize financial records, governance documents, and reporting processes." },
            ].map((item) => (
              <div key={item.title} className="rounded-3xl border border-soft-border bg-white p-7">
                <h3 className="text-xl font-semibold text-dark">{item.title}</h3>
                <p className="mt-3 text-[15px] text-muted">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="yield" className="bg-off-white py-20">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeader headline="What Afriekeza helps with" />
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: ClipboardList, title: "Funding preparation", desc: "Structure your raise with clear terms and documentation." },
              { icon: FileText, title: "Document organization", desc: "Prepare financial statements, compliance records, and disclosures." },
              { icon: Users, title: "Investor reach", desc: "Present your opportunity to verified investors." },
              { icon: BarChart3, title: "Post-funding reporting", desc: "Maintain investor trust with structured updates." },
            ].map((item) => (
              <div key={item.title} className="rounded-3xl border border-soft-border bg-white p-6">
                <item.icon className="h-6 w-6 text-blue" />
                <h4 className="mt-4 font-semibold text-dark">{item.title}</h4>
                <p className="mt-2 text-sm text-muted">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="readiness" className="py-20">
        <div className="mx-auto max-w-3xl px-6">
          <SectionHeader headline="Funding readiness checklist" subheadline="Investors expect clarity. Prepare these before applying." />
          <div className="mt-10 space-y-3">
            {[
              "Registered business entity with valid incorporation documents",
              "At least 12 months of operating history",
              "Financial statements or management accounts",
              "Tax compliance documentation",
              "Clear use of funds plan",
              "Governance structure and board information",
              "Business plan or growth strategy",
            ].map((item) => (
              <div key={item} className="flex items-center gap-3 rounded-2xl border border-soft-border bg-off-white px-5 py-4">
                <CheckCircle2 className="h-5 w-5 shrink-0 text-green" />
                <span className="text-dark">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="requirements" className="bg-off-white py-20">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeader headline="Issuer review process" />
          <div className="mt-14 grid gap-6 md:grid-cols-4">
            {[
              { step: "1", title: "Application", desc: "Submit company and funding details." },
              { step: "2", title: "Document review", desc: "We assess financials, governance, and compliance." },
              { step: "3", title: "Risk assessment", desc: "Opportunities receive clear risk labels." },
              { step: "4", title: "Listing", desc: "Approved raises are presented to verified investors." },
            ].map((item) => (
              <div key={item.step} className="rounded-3xl border border-soft-border bg-white p-6 text-center">
                <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-blue text-sm font-bold text-white">
                  {item.step}
                </div>
                <h4 className="font-semibold text-dark">{item.title}</h4>
                <p className="mt-2 text-sm text-muted">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="reporting" className="py-20">
        <div className="mx-auto max-w-3xl px-6">
          <SectionHeader headline="After funding" subheadline="Build long-term investor trust with structured reporting and transparency." />
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            <div id="use-of-funds" className="rounded-2xl border border-soft-border bg-white p-5 text-center">
              <h4 className="font-semibold text-dark">Use of Funds</h4>
              <p className="mt-2 text-sm text-muted">Track and report how capital is deployed.</p>
            </div>
            <div id="transparency" className="rounded-2xl border border-soft-border bg-white p-5 text-center">
              <h4 className="font-semibold text-dark">Transparency</h4>
              <p className="mt-2 text-sm text-muted">Share updates that build investor confidence.</p>
            </div>
            <div id="faqs" className="rounded-2xl border border-soft-border bg-white p-5 text-center">
              <h4 className="font-semibold text-dark">Issuer FAQs</h4>
              <p className="mt-2 text-sm text-muted">Common questions from founders answered.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="apply" className="bg-off-white py-20">
        <div className="mx-auto max-w-3xl px-6">
          <SectionHeader headline="Apply as a business" subheadline="Tell us about your company and funding needs." />
          <BusinessApplicationForm className="mt-10" />
        </div>
      </section>
    </>
  );
}
