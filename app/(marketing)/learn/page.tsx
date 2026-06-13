import { BookOpen, Coins, AlertTriangle, Layers, Scale, FileText } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { SectionHeader } from "@/components/section-header";
import { Button } from "@/components/ui/button";

const privateMarkets101 = [
  { id: "private-markets", title: "What Are Private Markets?", desc: "Private markets are where businesses raise capital outside public stock exchanges. In Africa, many growth companies operate here — accessing structured credit, convertible instruments, and private equity pathways." },
  { id: "private-credit", title: "What Is Private Credit?", desc: "Private credit is structured lending to businesses that may not qualify for traditional bank financing. Investors participate through notes with defined terms, repayment schedules, and risk disclosures." },
  { id: "tokenization", title: "What Is Tokenization?", desc: "Tokenization is the digital representation of ownership or investment rights. Afriekeza may use tokenization as infrastructure — not as speculation — to improve transparency and record-keeping." },
  { id: "revenue-backed", title: "What Is a Revenue-Backed Note?", desc: "A revenue-backed note links investor returns to a business's verified revenue performance. Terms, risks, and repayment structures are disclosed before participation." },
  { id: "capital-at-risk", title: "What Does Capital at Risk Mean?", desc: "Capital at risk means you may lose some or all of your invested money. Private-market opportunities are not deposits, savings accounts, or guaranteed-return products." },
];

const guides = [
  { id: "beginner-guide", title: "Beginner Investor Guide", desc: "A step-by-step introduction to understanding private markets, reading disclosures, and evaluating opportunities responsibly." },
  { id: "business-guide", title: "Business Funding Guide", desc: "How African businesses can prepare financial records, governance documents, and funding materials for structured capital raises." },
  { id: "risk-labels", title: "Risk Label Guide", desc: "How Afriekeza assesses and labels opportunity risk — helping investors understand what they are committing to." },
  { id: "glossary", title: "Afriekeza Glossary", desc: "Key terms in private markets, private credit, and investor protection — explained in plain language." },
  { id: "articles", title: "Articles & Insights", desc: "Perspectives on African private markets, SME finance, and responsible capital access." },
];

export default function LearnPage() {
  return (
    <>
      <PageHero
        headline="Learn before you invest."
        subheadline="Simple guides for understanding private markets, private credit, risk, tokenization, and investor protection."
      />

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeader headline="Private Markets 101" />
          <div className="mt-14 space-y-6">
            {privateMarkets101.map((item) => (
              <div key={item.id} id={item.id} className="rounded-3xl border border-soft-border bg-white p-8">
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-soft-green text-green">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-dark">{item.title}</h3>
                    <p className="mt-3 text-[15px] leading-relaxed text-muted">{item.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="risk" className="bg-off-white py-20">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeader headline="Risk & Investor Protection" subheadline="Understanding risk is the foundation of responsible investing." />
          <div className="mt-14 grid gap-6 md:grid-cols-2">
            <div className="rounded-3xl border border-warning/30 bg-warning/5 p-8">
              <AlertTriangle className="h-6 w-6 text-warning" />
              <h3 className="mt-4 text-xl font-semibold text-dark">Capital at risk</h3>
              <p className="mt-3 text-muted">Private-market opportunities may result in partial or total loss of invested capital. Afriekeza does not guarantee returns.</p>
            </div>
            <div className="rounded-3xl border border-soft-border bg-white p-8">
              <Scale className="h-6 w-6 text-blue" />
              <h3 className="mt-4 text-xl font-semibold text-dark">Risk labels</h3>
              <p className="mt-3 text-muted">Every opportunity includes a risk label based on business fundamentals, structure, and market factors. Read labels carefully before participating.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="tokenization" className="py-20">
        <div className="mx-auto max-w-3xl px-6">
          <SectionHeader headline="Tokenization Explained Simply" />
          <div className="mt-10 rounded-3xl border border-soft-border bg-white p-8">
            <Layers className="h-6 w-6 text-blue" />
            <p className="mt-4 text-[15px] leading-relaxed text-muted">
              Tokenization uses digital records to represent ownership or investment rights in a structured, auditable way. Afriekeza approaches tokenization as infrastructure for transparency and record-keeping — not as speculative trading. Any use of tokenization will be clearly disclosed with appropriate risk warnings.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-off-white py-20">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeader headline="Business Funding Guides" />
          <div className="mt-14 grid gap-6 md:grid-cols-2">
            {guides.map((item) => (
              <div key={item.id} id={item.id} className="rounded-3xl border border-soft-border bg-white p-7">
                <FileText className="h-5 w-5 text-blue" />
                <h3 className="mt-4 text-lg font-semibold text-dark">{item.title}</h3>
                <p className="mt-2 text-[15px] text-muted">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <SectionHeader headline="Ready to learn more?" subheadline="Explore investor opportunities or join the waitlist when you feel prepared." />
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Button href="/invest" variant="primary" size="lg">Explore Invest</Button>
            <Button href="/invest#waitlist" variant="outline" size="lg">Join Waitlist</Button>
          </div>
        </div>
      </section>
    </>
  );
}
