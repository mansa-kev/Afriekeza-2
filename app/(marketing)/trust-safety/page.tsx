import { Building2, Users, Scale, FileText, BarChart3, Lock, AlertTriangle } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { SectionHeader } from "@/components/section-header";
import { TrustCard } from "@/components/trust-card";

export default function TrustSafetyPage() {
  return (
    <>
      <PageHero
        headline="Trust is the foundation of Afriekeza."
        subheadline="Afriekeza is designed around clear information, responsible onboarding, issuer review, investor education, and transparent reporting."
        dark
      />

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <TrustCard icon="Building2" title="Vetted issuers" description="Every business goes through a review process covering fundamentals, governance, documentation, and suitability before any opportunity is presented to investors." accent="green" index={0} />
            <TrustCard icon="Users" title="Verified investors" description="Investors complete onboarding including identity verification and suitability assessment before accessing opportunities." accent="blue" index={1} />
            <TrustCard icon="Scale" title="Risk labels" description="Every opportunity receives a risk label based on business fundamentals, structure, and market factors. Labels help investors understand capital-at-risk." accent="green" index={2} />
            <TrustCard icon="FileText" title="Clear documents" description="Investors receive plain-language summaries of terms, risks, ownership rights, and reporting expectations before participating." accent="blue" index={3} />
            <TrustCard icon="BarChart3" title="Transparent reporting" description="Businesses provide structured updates after raising capital, including use-of-funds tracking and financial performance reports." accent="green" index={4} />
            <TrustCard icon="Lock" title="Data protection" description="Afriekeza is designed with data protection principles in mind. Personal and financial information is handled with appropriate security measures." accent="blue" index={5} />
          </div>
        </div>
      </section>

      <section className="bg-navy py-20">
        <div className="mx-auto max-w-3xl px-6">
          <SectionHeader
            headline="Responsible investing disclaimer"
            subheadline="Please read this carefully before considering any private-market opportunity."
            dark
          />
          <div className="mt-10 rounded-3xl border border-warning/30 bg-warning/10 p-8">
            <div className="flex items-start gap-4">
              <AlertTriangle className="h-6 w-6 shrink-0 text-warning" />
              <div className="text-white/80">
                <p className="text-[15px] leading-relaxed">
                  Afriekeza is building private capital markets infrastructure. Private-market opportunities may carry risk, including loss of capital and limited liquidity. Afriekeza does not guarantee returns. Past performance of any business is not indicative of future results. Users should read all disclosures carefully and consider seeking independent financial advice before making any investment decision.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
