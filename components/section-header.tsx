"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type SectionHeaderProps = {
  headline: React.ReactNode;
  subheadline?: string;
  align?: "left" | "center";
  dark?: boolean;
  className?: string;
  headlineClassName?: string;
};

export function SectionHeader({
  headline,
  subheadline,
  align = "center",
  dark = false,
  className,
  headlineClassName,
}: SectionHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5 }}
      className={cn(
        "mx-auto max-w-3xl",
        align === "center" && "text-center",
        className,
      )}
    >
      <h2
        className={cn(
          "font-display text-[30px] font-bold leading-tight tracking-tight md:text-[42px]",
          dark ? "text-white" : "text-navy",
          headlineClassName,
        )}
      >
        {headline}
      </h2>
      {subheadline && (
        <p
          className={cn(
            "mt-4 text-[17px] leading-relaxed md:text-lg",
            dark ? "text-white/70" : "text-muted",
          )}
        >
          {subheadline}
        </p>
      )}
    </motion.div>
  );
}
