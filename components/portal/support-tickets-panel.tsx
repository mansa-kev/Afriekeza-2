"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { createSupportTicket } from "@/lib/actions/portal";
import { StatusPill } from "@/components/portal/status-pill";

type Ticket = {
  id: string;
  category: string;
  subject: string;
  body: string;
  status: string;
  created_at: string;
};

const CATEGORIES = ["Account", "Verification", "Documents", "Investments", "Payments", "Other"];

export function SupportTicketsPanel({
  portal,
  tickets,
}: {
  portal: "investor" | "business" | "admin";
  tickets: Ticket[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await createSupportTicket({ portal, category, subject, body });
      if (result.error) {
        setError(result.error);
        return;
      }
      setSubject("");
      setBody("");
      router.refresh();
    });
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <form onSubmit={handleSubmit} className="rounded-2xl border border-header-border bg-white p-6 space-y-4">
        <h2 className="font-semibold text-dark">Open a ticket</h2>
        <select
          className="w-full rounded-xl border border-header-border px-4 py-2.5 text-sm"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <input
          className="w-full rounded-xl border border-header-border px-4 py-2.5 text-sm"
          placeholder="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          required
        />
        <textarea
          className="w-full rounded-xl border border-header-border px-4 py-2.5 text-sm"
          rows={4}
          placeholder="Describe your issue"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          required
        />
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        <Button variant="primary" disabled={pending}>
          {pending ? "Submitting…" : "Submit ticket"}
        </Button>
      </form>

      <div className="space-y-4">
        <h2 className="font-semibold text-dark">Your tickets</h2>
        {tickets.length === 0 ? (
          <p className="text-sm text-muted">No tickets yet.</p>
        ) : (
          tickets.map((ticket) => (
            <article key={ticket.id} className="rounded-xl border border-header-border bg-white p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-medium text-dark">{ticket.subject}</p>
                <StatusPill status={ticket.status.replaceAll("_", " ")} />
              </div>
              <p className="mt-1 text-xs text-muted">{ticket.category}</p>
              <p className="mt-2 text-sm text-muted">{ticket.body}</p>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
