import {
  Shield,
  FileText,
  Users,
  AlertTriangle,
  Scale,
  Coins,
  TrendingUp,
  Building,
  ArrowRight,
} from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { SectionHeader } from "@/components/section-header";
import { TrustCard } from "@/components/trust-card";
import { WaitlistForm } from "@/components/waitlist-form";

export default function InvestPage() {
  return (
    <>
      <PageHero
        headline="Private-market access, made easier to understand."
        subheadline="Discover how Afriekeza helps verified investors understand and access selected African private-market opportunities."
      />

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeader headline="What investors get" subheadline="A structured pathway to responsible private-market participation." />
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            <TrustCard icon="Shield" title="Verified access" description="Onboarded investors access risk-rated opportunities matched to their profile." accent="green" index={0} />
            <TrustCard icon="FileText" title="Clear disclosures" description="Every opportunity includes plain-language terms, risks, and ownership summaries." accent="blue" index={1} />
            <TrustCard icon="Users" title="Ongoing reporting" description="Receive structured updates from businesses after you participate." accent="green" index={2} />
          </div>
        </div>
      </section>

      <section id="yield" className="bg-off-white py-20">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeader headline="Types of opportunities" subheadline="Afriekeza begins with private credit and expands into broader private-market instruments." />
          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              { id: "yield", icon: Coins, title: "Afriekeza Yield", desc: "Structured private credit for vetted African growth businesses with clear repayment terms." },
              { id: "revenue-backed", icon: TrendingUp, title: "Revenue-Backed Notes", desc: "Opportunities linked to verified business revenue streams." },
              { id: "asset-backed", icon: Building, title: "Asset-Backed Notes", desc: "Notes supported by identifiable business assets." },
              { id: "growth-notes", icon: ArrowRight, title: "Growth Notes", desc: "Short-to-medium-term growth capital for expanding companies." },
              { id: "equity", icon: Scale, title: "Future Equity Opportunities", desc: "Convertible and equity pathways for qualified businesses." },
            ].map((item, i) => (
              <div key={item.id} id={item.id} className="rounded-3xl border border-soft-border bg-white p-7 shadow-sm">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-soft-green text-green">
                  <item.icon className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-semibold text-dark">{item.title}</h3>
                <p className="mt-2 text-[15px] text-muted">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeader headline="How investor onboarding works" />
          <div className="mt-14 grid gap-6 md:grid-cols-4">
            {[
              { step: "1", title: "Join waitlist", desc: "Register your interest and investor profile." },
              { step: "2", title: "Verification", desc: "Complete identity and suitability checks." },
              { step: "3", title: "Education", desc: "Review guides on risk and private markets." },
              { step: "4", title: "Participate", desc: "Access opportunities that match your profile." },
            ].map((item) => (
              <div key={item.step} className="rounded-3xl border border-soft-border bg-white p-6 text-center">
                <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-green text-sm font-bold text-white">
                  {item.step}
                </div>
                <h4 className="font-semibold text-dark">{item.title}</h4>
                <p className="mt-2 text-sm text-muted">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="what-you-own" className="bg-off-white py-20">
        <div className="mx-auto max-w-3xl px-6">
          <SectionHeader headline="Understanding risk" subheadline="Private-market opportunities carry capital at risk. Returns are not guaranteed and liquidity may be limited." />
          <div className="mt-10 rounded-3xl border border-warning/30 bg-warning/5 p-8">
            <div className="flex items-start gap-4">
              <AlertTriangle className="h-6 w-6 shrink-0 text-warning" />
              <div>
                <h4 className="font-semibold text-dark">Capital at risk</h4>
                <p className="mt-2 text-muted">
                  Every opportunity on Afriekeza includes a risk label. You may lose some or all of your invested capital. Read all disclosures carefully before participating.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-3xl px-6">
          <SectionHeader headline="What You Own" subheadline="Before participating, understand exactly what rights and instruments you hold." />
          <div className="mt-10 space-y-4">
            {[
              "Instrument type — note, convertible, or equity pathway",
              "Repayment or return structure and timeline",
              "Your rights as an investor in the opportunity",
              "Reporting schedule and update expectations",
              "Liquidity limitations and exit considerations",
            ].map((item) => (
              <div key={item} className="flex items-center gap-3 rounded-2xl border border-soft-border bg-white px-5 py-4">
                <FileText className="h-5 w-5 shrink-0 text-blue" />
                <span className="text-dark">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="faqs" className="bg-off-white py-20">
        <div className="mx-auto max-w-3xl px-6">
          <SectionHeader headline="Investor FAQs" />
          <div className="mt-10 space-y-4">
            {[
              { q: "Who can invest on Afriekeza?", a: "Verified investors who complete onboarding and suitability checks. Investor categories include Kenya-based individuals, diaspora investors, institutions, and organized groups." },
              { q: "Are returns guaranteed?", a: "No. Private-market opportunities carry risk, including loss of capital. Afriekeza does not guarantee returns." },
              { q: "How are opportunities reviewed?", a: "Every issuer goes through a review process covering business fundamentals, governance, documentation, and risk assessment before listing." },
              { q: "Can I sell my position anytime?", a: "Private-market instruments typically have limited liquidity. Review each opportunity's terms for exit and transfer conditions." },
            ].map((faq) => (
              <div key={faq.q} className="rounded-2xl border border-soft-border bg-white p-6">
                <h4 className="font-semibold text-dark">{faq.q}</h4>
                <p className="mt-2 text-[15px] text-muted">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="waitlist" className="py-20">
        <div className="mx-auto max-w-3xl px-6">
          <SectionHeader headline="Join the investor waitlist" subheadline="Be among the first verified investors when Afriekeza opens onboarding." />
          <WaitlistForm className="mt-10" />
        </div>
      </section>
    </>
  );
}
