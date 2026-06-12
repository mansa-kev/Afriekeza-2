"use client";

import { motion } from "framer-motion";

type PageHeroProps = {
  headline: string;
  subheadline: string;
  dark?: boolean;
};

export function PageHero({ headline, subheadline, dark = false }: PageHeroProps) {
  return (
    <section
      className={
        dark
          ? "bg-navy py-20 md:py-28"
          : "border-b border-soft-border bg-white py-20 md:py-28"
      }
    >
      <div className="mx-auto max-w-4xl px-6 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={`font-display text-[36px] font-bold leading-tight tracking-tight md:text-[52px] ${
            dark ? "text-white" : "text-navy"
          }`}
        >
          {headline}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className={`mx-auto mt-5 max-w-2xl text-lg leading-relaxed ${
            dark ? "text-white/70" : "text-muted"
          }`}
        >
          {subheadline}
        </motion.p>
      </div>
    </section>
  );
}
