import { SectionHeader } from "@/components/section-header";
import { StepCard } from "@/components/step-card";

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="bg-off-white py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeader headline="How Afriekeza works" />
        <div className="mt-14 flex flex-col gap-10 md:flex-row md:gap-4">
          <StepCard
            step={1}
            title="Businesses apply"
            description="Companies submit business, financial, and funding information."
            icon="Briefcase"
            index={0}
          />
          <StepCard
            step={2}
            title="Afriekeza reviews"
            description="We assess documents, governance, risk, and suitability."
            icon="ClipboardList"
            index={1}
          />
          <StepCard
            step={3}
            title="Opportunities are listed"
            description="Approved opportunities are presented with clear terms and risk labels."
            icon="BarChart3"
            index={2}
          />
          <StepCard
            step={4}
            title="Investors participate"
            description="Verified investors choose opportunities that match their profile."
            icon="Users"
            index={3}
          />
          <StepCard
            step={5}
            title="Reporting continues"
            description="Investors receive updates after funding."
            icon="FileText"
            index={4}
            isLast
          />
        </div>
      </div>
    </section>
  );
}
