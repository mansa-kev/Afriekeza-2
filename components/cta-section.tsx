"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

type CtaSectionProps = {
  headline: string;
  body: string;
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  tertiaryCta?: { label: string; href: string };
};

export function CtaSection({
  headline,
  body,
  primaryCta,
  secondaryCta,
  tertiaryCta,
}: CtaSectionProps) {
  return (
    <section className="relative overflow-hidden bg-navy py-24 md:py-32">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(57,196,74,0.15),_transparent_50%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(20,119,201,0.15),_transparent_50%)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center opacity-[0.06]">
        <Image
          src="/afriekeza-logo-transparent.png"
          alt=""
          width={2951}
          height={973}
          aria-hidden
          className="h-auto w-[min(92vw,900px)]"
        />
      </div>

      <div className="relative mx-auto max-w-4xl px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="font-display text-[34px] font-bold leading-tight tracking-tight text-white md:text-[52px]">
            {headline}
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-white/70">{body}</p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            {primaryCta && (
              <Button href={primaryCta.href} variant="primary" size="lg">
                {primaryCta.label}
              </Button>
            )}
            {secondaryCta && (
              <Button href={secondaryCta.href} variant="white" size="lg">
                {secondaryCta.label}
              </Button>
            )}
            {tertiaryCta && (
              <Button href={tertiaryCta.href} variant="outline" size="lg" className="border-white/20 bg-transparent text-white hover:bg-white/10">
                {tertiaryCta.label}
              </Button>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
