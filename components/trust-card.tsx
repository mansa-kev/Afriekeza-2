"use client";

import { motion } from "framer-motion";
import {
  BarChart3,
  Building2,
  FileText,
  Lock,
  Scale,
  Search,
  Shield,
  ShieldCheck,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";

const trustIcons = {
  BarChart3,
  Building2,
  FileText,
  Lock,
  Scale,
  Search,
  Shield,
  ShieldCheck,
  Users,
} as const;

export type TrustCardIcon = keyof typeof trustIcons;

type TrustCardProps = {
  icon: TrustCardIcon;
  title: string;
  description: string;
  dark?: boolean;
  accent?: "green" | "blue";
  index?: number;
};

export function TrustCard({
  icon,
  title,
  description,
  dark = false,
  accent = "green",
  index = 0,
}: TrustCardProps) {
  const Icon = trustIcons[icon];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.45, delay: index * 0.08 }}
      className={cn(
        "card-hover rounded-3xl border p-7",
        dark
          ? "border-white/12 bg-white/5 hover:border-white/20 hover:bg-white/8"
          : "border-soft-border bg-card shadow-sm hover:shadow-lg",
      )}
    >
      <div
        className={cn(
          "mb-5 flex h-11 w-11 items-center justify-center rounded-full",
          accent === "green"
            ? dark
              ? "bg-green/20 text-green"
              : "bg-soft-green text-green"
            : dark
              ? "bg-blue/20 text-blue"
              : "bg-soft-blue text-blue",
        )}
      >
        <Icon className="h-5 w-5" />
      </div>
      <h3
        className={cn(
          "text-xl font-semibold",
          dark ? "text-white" : "text-dark",
        )}
      >
        {title}
      </h3>
      <p
        className={cn(
          "mt-2 text-[15px] leading-relaxed",
          dark ? "text-white/65" : "text-muted",
        )}
      >
        {description}
      </p>
    </motion.div>
  );
}
