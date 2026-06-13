"use client";

import Link from "next/link";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Bell } from "lucide-react";
import { markNotificationRead } from "@/lib/actions/operational";
import { cn } from "@/lib/utils";

type Notification = {
  id: string;
  title: string;
  body: string;
  link: string | null;
  read_at: string | null;
  created_at: string;
};

export function NotificationMenu({ notifications }: { notifications: Notification[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const unread = notifications.filter((n) => !n.read_at).length;

  function markRead(id: string) {
    startTransition(async () => {
      await markNotificationRead(id);
      router.refresh();
    });
  }

  return (
    <div className="group relative">
      <button
        type="button"
        className="relative rounded-xl border border-header-border p-2 text-muted transition-colors hover:text-dark"
        aria-label="Notifications"
      >
        <Bell className="h-4 w-4" />
        {unread > 0 ? (
          <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-blue px-1 text-[10px] font-bold text-white">
            {unread}
          </span>
        ) : null}
      </button>
      <div className="invisible absolute right-0 z-50 mt-2 w-80 rounded-xl border border-header-border bg-white opacity-0 shadow-lg transition-all group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
        <div className="border-b border-header-border px-4 py-3 text-sm font-semibold text-dark">Notifications</div>
        <ul className="max-h-80 overflow-y-auto">
          {notifications.length === 0 ? (
            <li className="px-4 py-6 text-sm text-muted">No notifications yet.</li>
          ) : (
            notifications.map((n) => (
              <li
                key={n.id}
                className={cn(
                  "border-b border-header-border px-4 py-3 text-sm last:border-0",
                  !n.read_at && "bg-soft-blue/30",
                )}
              >
                <p className="font-medium text-dark">{n.title}</p>
                <p className="mt-1 text-muted">{n.body}</p>
                <div className="mt-2 flex gap-3">
                  {n.link ? (
                    <Link href={n.link} className="text-xs text-blue hover:underline">
                      View
                    </Link>
                  ) : null}
                  {!n.read_at ? (
                    <button
                      type="button"
                      className="text-xs text-muted hover:text-dark"
                      disabled={pending}
                      onClick={() => markRead(n.id)}
                    >
                      Mark read
                    </button>
                  ) : null}
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
