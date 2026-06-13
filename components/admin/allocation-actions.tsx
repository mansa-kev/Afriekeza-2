"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { StatusPill } from "@/components/portal/status-pill";
import { allocateCommitment, cancelCommitment, updateSupportTicketStatus } from "@/lib/actions/portal";

export function AllocationActions({ commitmentId }: { commitmentId: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function allocate() {
    startTransition(async () => {
      await allocateCommitment(commitmentId);
      router.refresh();
    });
  }

  function cancel() {
    startTransition(async () => {
      await cancelCommitment(commitmentId);
      router.refresh();
    });
  }

  return (
    <div className="mt-4 flex gap-2">
      <Button variant="primary" size="sm" disabled={pending} onClick={allocate}>
        Allocate
      </Button>
      <Button variant="outline" size="sm" disabled={pending} onClick={cancel}>
        Cancel
      </Button>
    </div>
  );
}

export function AdminSupportActions({
  ticketId,
  status,
}: {
  ticketId: string;
  status: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function update(next: "in_progress" | "resolved" | "closed") {
    startTransition(async () => {
      await updateSupportTicketStatus(ticketId, next);
      router.refresh();
    });
  }

  if (status === "closed") return null;

  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {status === "open" && (
        <Button variant="outline" size="sm" disabled={pending} onClick={() => update("in_progress")}>
          Start
        </Button>
      )}
      <Button variant="primary" size="sm" disabled={pending} onClick={() => update("resolved")}>
        Resolve
      </Button>
      <Button variant="outline" size="sm" disabled={pending} onClick={() => update("closed")}>
        Close
      </Button>
    </div>
  );
}

export function AllocationStatusPill({ status }: { status: string }) {
  return <StatusPill status={status.replaceAll("_", " ")} />;
}
