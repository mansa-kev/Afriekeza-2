import Image from "next/image";
import {
  Building2,
  ShieldCheck,
  TrendingUp,
  Coins,
  Database,
  FileText,
  Users,
  BarChart3,
  FolderOpen,
  PieChart,
  ClipboardList,
  Briefcase,
  CheckCircle2,
} from "lucide-react";
import { HeroSection } from "@/components/hero-section";
import { SectionHeader } from "@/components/section-header";
import { InvestmentProductsSection } from "@/components/investment-products-section";
import { TrustCard } from "@/components/trust-card";
import { ProductCard } from "@/components/product-card";
import { CtaSection } from "@/components/cta-section";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <>
      <HeroSection />

      {/* Section 2: Platform + Products */}
      <section className="bg-white py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeader
            headline="Afriekeza connects investors, issuers, and the infrastructure that holds both to a higher standard."
            subheadline="Three systems. One standard for how private capital should work."
          />
          <div className="mt-14 grid gap-6 lg:grid-cols-3">
            <ProductCard
              label="Private Credit"
              title="Afriekeza Yield"
              description="Structured private credit for vetted African growth businesses."
              href="/invest#yield"
              cta="Explore Yield"
              icon="Coins"
              variant="green"
              index={0}
            />
            <ProductCard
              label="Capital Raising"
              title="Afriekeza Raise"
              description="A better pathway for qualified companies to prepare, structure, and raise private capital."
              href="/raise"
              cta="Apply to Raise"
              icon="TrendingUp"
              variant="blue"
              index={1}
            />
            <ProductCard
              label="Infrastructure"
              title="Afriekeza Registry"
              description="Cap tables, data rooms, investor updates, ESOPs, and reporting infrastructure for growing companies."
              href="/registry"
              cta="View Registry"
              icon="Database"
              variant="navy"
              index={2}
            />
          </div>

          <div className="mt-16 grid items-center gap-10 lg:mt-20 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8 xl:gap-12">
            <h2 className="font-display text-left text-[26px] leading-snug font-medium tracking-tight text-dark sm:text-[30px] md:text-[34px] md:leading-tight lg:text-[38px] xl:text-[42px]">
              Private capital access should be{" "}
              <span className="font-bold text-blue">clearer</span>, more{" "}
              <span className="font-bold text-navy">structured</span>,
              <br className="md:hidden" /> and easier to{" "}
              <span className="font-bold text-green">trust</span>.
            </h2>

            <figure className="relative flex w-full items-center justify-center lg:justify-end">
              <div className="relative w-full max-w-[520px] lg:max-w-[560px]">
                <div
                  aria-hidden
                  className="pointer-events-none absolute bottom-[4%] left-1/2 z-0 h-10 w-[78%] -translate-x-1/2 rounded-full bg-navy/[0.07] blur-2xl"
                />
                <Image
                  src="/platform-dashboard-mockup-transparent.png"
                  alt="Afriekeza investor dashboard showing portfolio performance, allocation, and private market opportunities"
                  width={1024}
                  height={768}
                  sizes="(max-width: 1024px) 100vw, 560px"
                  className="relative z-[1] h-auto w-full object-contain drop-shadow-[0_28px_56px_rgba(6,27,46,0.14)]"
                />
              </div>
            </figure>
          </div>
        </div>
      </section>

      <InvestmentProductsSection />

      {/* Section 4: Trust */}
      <section className="bg-navy py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeader
            headline="We do not just connect capital. We build trust."
            subheadline="Afriekeza is designed around the information investors need before capital is committed and the reporting discipline businesses need after capital is raised."
            dark
          />
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            <TrustCard
              icon="Building2"
              title="Vetted Businesses"
              description="Every issuer goes through a review process before listing."
              dark
              accent="green"
              index={0}
            />
            <TrustCard
              icon="Users"
              title="Verified Investors"
              description="Investors are onboarded and categorized before participation."
              dark
              accent="blue"
              index={1}
            />
            <TrustCard
              icon="FileText"
              title="Clear Documents"
              description="Investors see key terms, risks, and ownership summaries."
              dark
              accent="green"
              index={2}
            />
            <TrustCard
              icon="BarChart3"
              title="Transparent Reporting"
              description="Businesses provide updates after raising capital."
              dark
              accent="blue"
              index={3}
            />
            <TrustCard
              icon="ShieldCheck"
              title="Compliance-First Design"
              description="Afriekeza is built for responsible private-market access."
              dark
              accent="green"
              index={4}
            />
          </div>
        </div>
      </section>

      {/* Section 8: For Businesses */}
      <section className="bg-off-white py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <SectionHeader
                headline="Raise capital with clarity, structure, and investor confidence."
                subheadline="Afriekeza helps credible companies prepare for capital raising, organize their documents, present opportunities clearly, and report professionally after funding."
                align="left"
              />
              <ul className="mt-8 space-y-4">
                {[
                  "Raise structured growth capital",
                  "Prepare clean funding documents",
                  "Reach verified investors",
                  "Manage reporting after funding",
                  "Build long-term trust",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-dark">
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-green" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <Button href="/raise#apply" variant="secondary" size="lg">
                  Apply to Raise Capital
                </Button>
              </div>
            </div>
            <BusinessDashboardMockup />
          </div>
        </div>
      </section>

      {/* Section 9: Registry Preview */}
      <section className="bg-white py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeader
            headline="Before you raise, organize ownership."
            subheadline="Afriekeza Registry helps companies manage cap tables, data rooms, investor updates, ESOPs, and compliance documents."
          />
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {[
              { icon: PieChart, title: "Cap Table Management" },
              { icon: FolderOpen, title: "Data Room" },
              { icon: FileText, title: "Investor Updates" },
              { icon: Users, title: "ESOP Management" },
              { icon: ClipboardList, title: "Compliance Documents" },
            ].map((item) => (
              <div
                key={item.title}
                className="card-hover rounded-3xl border border-soft-border bg-off-white p-6 text-center"
              >
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-soft-blue text-blue">
                  <item.icon className="h-5 w-5" />
                </div>
                <h4 className="text-sm font-semibold text-dark">{item.title}</h4>
              </div>
            ))}
          </div>
          <RegistryMockup />
          <div className="mt-10 text-center">
            <Button href="/registry" variant="outline" size="lg">
              Request Registry Access
            </Button>
          </div>
        </div>
      </section>

      {/* Section 10: Final CTA */}
      <CtaSection
        headline="Africa Invests. Africa Builds. Africa Owns."
        body="Join the platform building transparent private-market infrastructure for African growth companies and verified investors."
        primaryCta={{ label: "Join Investor Waitlist", href: "/invest#waitlist" }}
        secondaryCta={{ label: "Apply as a Business", href: "/raise#apply" }}
        tertiaryCta={{ label: "Partner With Us", href: "/institutions#partner" }}
      />
    </>
  );
}

function BusinessDashboardMockup() {
  return (
    <div className="rounded-3xl border border-soft-border bg-white p-6 shadow-xl">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-dark">Company Profile</p>
          <p className="text-xs text-muted">AgriTech Solutions Ltd</p>
        </div>
        <span className="rounded-full bg-soft-green px-3 py-1 text-xs font-medium text-green">
          Under Review
        </span>
      </div>
      <div className="mb-4 rounded-2xl bg-off-white p-4">
        <p className="text-xs text-muted">Funding Target</p>
        <p className="text-2xl font-bold text-dark">KES 15,000,000</p>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-soft-border">
          <div className="h-full w-1/3 rounded-full bg-blue" />
        </div>
      </div>
      <p className="mb-2 text-xs font-semibold tracking-wide text-muted uppercase">
        Document Checklist
      </p>
      <div className="space-y-2">
        {[
          { doc: "Financial Statements", done: true },
          { doc: "Tax Compliance Certificate", done: true },
          { doc: "Board Resolution", done: false },
          { doc: "Use of Funds Plan", done: false },
        ].map((item) => (
          <div
            key={item.doc}
            className="flex items-center justify-between rounded-lg border border-soft-border px-3 py-2 text-sm"
          >
            <span className="text-dark">{item.doc}</span>
            {item.done ? (
              <CheckCircle2 className="h-4 w-4 text-green" />
            ) : (
              <span className="text-xs text-muted">Pending</span>
            )}
          </div>
        ))}
      </div>
      <div className="mt-4 rounded-2xl border border-soft-border p-4">
        <p className="text-xs font-semibold text-muted">Reporting Status</p>
        <p className="mt-1 text-sm text-dark">Next update due in 14 days</p>
      </div>
    </div>
  );
}

function RegistryMockup() {
  return (
    <div className="mt-10 overflow-hidden rounded-3xl border border-soft-border bg-white shadow-lg">
      <div className="border-b border-soft-border bg-off-white px-6 py-3">
        <p className="text-sm font-semibold text-dark">Cap Table — AgriTech Solutions</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-soft-border text-left text-xs text-muted uppercase">
              <th className="px-6 py-3">Shareholder</th>
              <th className="px-6 py-3">Shares</th>
              <th className="px-6 py-3">Ownership</th>
              <th className="px-6 py-3">Type</th>
            </tr>
          </thead>
          <tbody>
            {[
              { name: "Founders", shares: "6,000,000", pct: "60%", type: "Common" },
              { name: "Seed Investors", shares: "2,000,000", pct: "20%", type: "Preferred" },
              { name: "ESOP Pool", shares: "1,000,000", pct: "10%", type: "Options" },
              { name: "Advisors", shares: "1,000,000", pct: "10%", type: "Common" },
            ].map((row) => (
              <tr key={row.name} className="border-b border-soft-border last:border-0">
                <td className="px-6 py-3 font-medium text-dark">{row.name}</td>
                <td className="px-6 py-3 text-muted">{row.shares}</td>
                <td className="px-6 py-3 text-muted">{row.pct}</td>
                <td className="px-6 py-3">
                  <span className="rounded-full bg-soft-blue px-2 py-0.5 text-xs text-blue">
                    {row.type}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
