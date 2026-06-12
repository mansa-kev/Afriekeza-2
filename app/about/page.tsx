import { Target, MapPin, Coins, ShieldCheck, Users } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { SectionHeader } from "@/components/section-header";
import { Button } from "@/components/ui/button";

export default function AboutPage() {
  return (
    <>
      <PageHero
        headline="Building Africa's private capital markets infrastructure."
        subheadline="Afriekeza exists to help African businesses access structured capital and help investors participate in real growth opportunities with clarity and trust."
      />

      <section id="mission" className="py-20">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeader headline="Our mission" subheadline="Africa Invests — connecting vetted businesses with verified investors through trusted infrastructure." />
          <div className="mt-14 grid gap-6 md:grid-cols-2">
            <div className="rounded-3xl border border-soft-border bg-white p-8">
              <Target className="h-6 w-6 text-green" />
              <h3 className="mt-4 text-xl font-semibold text-dark">Mission</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-muted">
                To build the trusted infrastructure that connects African growth businesses with responsible capital — starting with private credit and registry tools, expanding into broader private-market access.
              </p>
            </div>
            <div className="rounded-3xl border border-soft-border bg-white p-8">
              <ShieldCheck className="h-6 w-6 text-blue" />
              <h3 className="mt-4 text-xl font-semibold text-dark">Vision</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-muted">
                An Africa where every credible growth business can access structured capital, and every verified investor can participate in real opportunities with clarity, rights, and transparent reporting.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-off-white py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-12 lg:grid-cols-3">
            <div className="rounded-3xl border border-soft-border bg-white p-8">
              <MapPin className="h-6 w-6 text-blue" />
              <h3 className="mt-4 text-xl font-semibold text-dark">Why Kenya first</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-muted">
                Kenya has a vibrant entrepreneurial ecosystem, growing fintech infrastructure, and a regulatory environment actively shaping capital markets innovation. Afriekeza begins here to build a model that can expand across Africa.
              </p>
            </div>
            <div className="rounded-3xl border border-soft-border bg-white p-8">
              <Coins className="h-6 w-6 text-green" />
              <h3 className="mt-4 text-xl font-semibold text-dark">Why private credit first</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-muted">
                Private credit addresses the most immediate gap: growth businesses that need capital but are not yet suited for banks or public markets. Structured notes with clear terms and risk labels create a responsible starting point.
              </p>
            </div>
            <div className="rounded-3xl border border-soft-border bg-white p-8">
              <ShieldCheck className="h-6 w-6 text-blue" />
              <h3 className="mt-4 text-xl font-semibold text-dark">Why trust matters</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-muted">
                Capital markets only work when both sides trust the infrastructure. Afriekeza is built around vetting, verification, clear documents, and transparent reporting — not hype or promises.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="advisors" className="py-20">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeader headline="Team" subheadline="Afriekeza is built by people who understand African finance, technology, and responsible market development." />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {["Founder & CEO", "Head of Product", "Head of Compliance", "Head of Partnerships"].map((role) => (
              <div key={role} className="rounded-3xl border border-soft-border bg-off-white p-6 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-soft-blue">
                  <Users className="h-7 w-7 text-blue" />
                </div>
                <p className="font-semibold text-dark">Team Member</p>
                <p className="mt-1 text-sm text-muted">{role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="newsroom" className="bg-off-white py-20">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <SectionHeader headline="Newsroom" subheadline="Company updates and announcements will appear here as Afriekeza grows." />
        </div>
      </section>

      <section id="faqs" className="py-20">
        <div className="mx-auto max-w-3xl px-6">
          <SectionHeader headline="FAQs" />
          <div className="mt-10 space-y-4">
            {[
              { q: "What is Afriekeza?", a: "Afriekeza is Africa's private capital markets platform — helping vetted businesses raise structured capital and giving verified investors access to risk-rated private-market opportunities." },
              { q: "Is Afriekeza live?", a: "Afriekeza is currently in development. Join the investor waitlist or apply as a business to be notified when onboarding opens." },
              { q: "Where is Afriekeza based?", a: "Afriekeza is headquartered in Nairobi, Kenya." },
            ].map((faq) => (
              <div key={faq.q} className="rounded-2xl border border-soft-border bg-white p-6">
                <h4 className="font-semibold text-dark">{faq.q}</h4>
                <p className="mt-2 text-[15px] text-muted">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="careers" className="bg-off-white py-20">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <SectionHeader headline="Careers" subheadline="We are building a team passionate about African finance and responsible market infrastructure. Roles will be posted here." />
        </div>
      </section>

      <section id="legal" className="py-20">
        <div className="mx-auto max-w-3xl px-6">
          <SectionHeader headline="Legal & Disclosures" />
          <p className="mt-8 text-[15px] leading-relaxed text-muted">
            Afriekeza is building private capital markets infrastructure. Private-market opportunities may carry risk, including loss of capital and limited liquidity. Afriekeza does not guarantee returns. Users should read all disclosures carefully before making any investment decision.
          </p>
        </div>
      </section>

      <section className="bg-off-white py-20">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <SectionHeader headline="Get in touch" subheadline="We would love to hear from you." />
          <Button href="/contact" variant="primary" size="lg" className="mt-8">
            Contact Us
          </Button>
        </div>
      </section>
    </>
  );
}
