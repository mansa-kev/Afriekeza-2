import Link from "next/link";
import { BookOpen } from "lucide-react";
import { PortalCard } from "@/components/portal/portal-card";
import { PortalPageHeader } from "@/components/portal/page-header";

const TOPICS = [
  { title: "Private Markets 101", description: "How private-market investing works on Afriekeza.", href: "/learn#private-markets" },
  { title: "Private Credit", description: "Understanding revenue-backed and yield products.", href: "/learn#private-credit" },
  { title: "What You Own", description: "Legal structure and economic exposure explained.", href: "/invest#what-you-own" },
  { title: "Reading Deal Documents", description: "Key terms to review before committing.", href: "/learn#beginner-guide" },
  { title: "Risk Labels", description: "How we classify product risk levels.", href: "/learn#risk-labels" },
];

export default function LearnPortalPage() {
  return (
    <div className="space-y-6">
      <PortalPageHeader
        title="Learn"
        description="Guides to help you understand private markets before you participate."
      />

      <div className="grid gap-3">
        {TOPICS.map((t) => (
          <Link key={t.href} href={t.href}>
            <PortalCard hover className="flex items-start gap-4 transition-colors hover:border-blue/20">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-soft-green text-green">
                <BookOpen className="h-5 w-5" />
              </span>
              <div>
                <p className="font-semibold text-dark">{t.title}</p>
                <p className="mt-0.5 text-sm text-muted">{t.description}</p>
              </div>
            </PortalCard>
          </Link>
        ))}
      </div>
    </div>
  );
}
