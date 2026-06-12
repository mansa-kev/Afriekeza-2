"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Coins, Database, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

const productIcons = {
  Coins,
  TrendingUp,
  Database,
} as const;

export type ProductCardIcon = keyof typeof productIcons;

type ProductCardProps = {
  label: string;
  title: string;
  description: string;
  href: string;
  cta: string;
  icon: ProductCardIcon;
  variant: "green" | "blue" | "navy";
  index?: number;
};

const variantStyles = {
  green: {
    bg: "from-soft-green to-white",
    pill: "bg-soft-green text-green",
    icon: "bg-green/15 text-green",
    hover: "group-hover:text-green",
  },
  blue: {
    bg: "from-soft-blue to-white",
    pill: "bg-soft-blue text-blue",
    icon: "bg-blue/15 text-blue",
    hover: "group-hover:text-blue",
  },
  navy: {
    bg: "from-navy/5 to-white",
    pill: "bg-navy/10 text-navy",
    icon: "bg-navy/10 text-navy",
    hover: "group-hover:text-blue",
  },
};

export function ProductCard({
  label,
  title,
  description,
  href,
  cta,
  icon,
  variant,
  index = 0,
}: ProductCardProps) {
  const Icon = productIcons[icon];
  const styles = variantStyles[variant];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.45, delay: index * 0.1 }}
      className={cn(
        "card-hover group relative overflow-hidden rounded-3xl border border-soft-border bg-gradient-to-b p-8 shadow-sm",
        styles.bg,
      )}
    >
      <div
        className={cn(
          "mb-6 flex h-14 w-14 items-center justify-center rounded-2xl",
          styles.icon,
        )}
      >
        <Icon className="h-7 w-7" />
      </div>
      <span
        className={cn(
          "inline-block rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide",
          styles.pill,
        )}
      >
        {label}
      </span>
      <h3 className="mt-4 text-2xl font-bold text-dark">{title}</h3>
      <p className="mt-3 text-[16px] leading-relaxed text-muted">
        {description}
      </p>
      <Link
        href={href}
        className={cn(
          "mt-6 inline-flex items-center gap-2 text-[15px] font-medium text-dark transition-colors",
          styles.hover,
        )}
      >
        {cta}
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </Link>
    </motion.div>
  );
}
