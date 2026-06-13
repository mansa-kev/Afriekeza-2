"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

type PortalSidebarContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
  toggle: () => void;
  close: () => void;
};

const PortalSidebarContext = createContext<PortalSidebarContextValue | null>(
  null,
);

function defaultSidebarOpen() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(min-width: 1024px)").matches;
}

export function PortalSidebarProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("afriekeza-sidebar-open");
    if (stored !== null) {
      setOpen(stored === "true");
    } else {
      setOpen(defaultSidebarOpen());
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem("afriekeza-sidebar-open", String(open));
  }, [open, hydrated]);

  const toggle = useCallback(() => setOpen((v) => !v), []);
  const close = useCallback(() => setOpen(false), []);

  return (
    <PortalSidebarContext.Provider value={{ open, setOpen, toggle, close }}>
      {children}
    </PortalSidebarContext.Provider>
  );
}

export function usePortalSidebar() {
  const ctx = useContext(PortalSidebarContext);
  if (!ctx) {
    throw new Error("usePortalSidebar must be used within PortalSidebarProvider");
  }
  return ctx;
}
