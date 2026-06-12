"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-white pb-8 md:pb-12">
      {/* Hero copy */}
      <div className="relative z-10 mx-auto max-w-4xl px-6 pt-20 text-center md:pt-28">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="font-display mb-5 text-[13px] font-semibold tracking-[0.18em] text-blue uppercase"
        >
          Africa Invests
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.08 }}
          className="font-display text-[38px] leading-[1.08] font-bold tracking-tight text-navy md:text-[64px] lg:text-[72px]"
        >
          Invest in Africa&apos;s growth beyond banks and public markets.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.16 }}
          className="mx-auto mt-6 max-w-[34rem] text-[17px] leading-relaxed text-muted md:text-[19px]"
        >
          Structured private-market access for verified investors and vetted
          African businesses.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.24 }}
          className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4"
        >
          <Button href="/invest#waitlist" variant="primary" size="lg">
            Join Investor Waitlist
          </Button>
          <Button href="/raise#apply" variant="outline" size="lg">
            Apply as a Business
          </Button>
        </motion.div>
      </div>

      {/* ADDX-style integrated stage: panel + embedded logo + glass + phone */}
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.75, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-20 mx-auto mt-10 w-full max-w-[1080px] px-4 md:mt-14 md:px-8 lg:mt-16"
      >
        {/* Phone extends above panel; hand meets panel floor */}
        <div className="relative h-[min(58vw,420px)] sm:h-[min(50vw,400px)] md:h-[420px] lg:h-[440px]">
          {/* Rounded visual panel */}
          <div
            aria-hidden
            className="absolute inset-x-0 bottom-0 h-[min(34vw,200px)] overflow-hidden rounded-[1.75rem] border border-white/80 shadow-[0_28px_80px_-40px_rgba(6,27,46,0.18)] sm:h-[210px] md:h-[240px] md:rounded-[2.25rem] lg:h-[260px]"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-[#f6f9fc] via-stage to-[#e7edf4]" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,_rgba(20,119,201,0.07),_transparent_58%)]" />
            <div className="absolute inset-x-0 top-0 h-px bg-white/90" />

            {/* Embedded brand logo — infrastructure watermark inside panel */}
            <div className="absolute inset-0 flex items-center justify-center">
              <Image
                src="/afriekeza-logo-transparent.png"
                alt=""
                width={2951}
                height={973}
                aria-hidden
                className="h-auto w-[min(118%,920px)] max-w-none -translate-y-2 opacity-[0.1] blur-[0.3px] md:opacity-[0.12] lg:opacity-[0.14]"
              />
            </div>

            {/* Soft brand tint behind phone zone */}
            <div className="absolute left-1/2 top-[8%] h-[72%] w-[min(78%,360px)] -translate-x-1/2 rounded-[2rem] bg-[radial-gradient(ellipse_at_center,_rgba(57,196,74,0.05),_transparent_70%)]" />
          </div>

          {/* Light glass layer — sits above logo, below phone */}
          <div
            aria-hidden
            className="pointer-events-none absolute bottom-[min(8vw,52px)] left-1/2 z-[2] h-[min(38vw,250px)] w-[min(62vw,290px)] -translate-x-1/2 rounded-[1.65rem] border border-white/75 bg-gradient-to-b from-white/62 via-white/38 to-white/18 shadow-[inset_0_1px_0_rgba(255,255,255,0.95),0_16px_48px_-24px_rgba(6,27,46,0.14)] backdrop-blur-[14px] sm:bottom-[58px] sm:h-[255px] sm:w-[300px] md:bottom-[64px] md:h-[270px] md:w-[310px] lg:bottom-[72px] lg:h-[285px] lg:w-[320px]"
          />

          {/* Contact shadow where phone meets the stage surface */}
          <div
            aria-hidden
            className="pointer-events-none absolute bottom-[min(5vw,30px)] left-1/2 z-[3] h-5 w-[min(48vw,210px)] -translate-x-1/2 rounded-full bg-navy/[0.08] blur-xl sm:bottom-[34px] md:bottom-[38px] md:h-6 md:w-[220px]"
          />

          {/* Phone — main focal object, restrained scale */}
          <div className="absolute inset-x-0 bottom-0 z-[4] flex justify-center">
            <Image
              src="/hero-phone-mockup-v2.png"
              alt="Afriekeza mobile app showing portfolio overview and market opportunities"
              width={816}
              height={1024}
              priority
              unoptimized
              className="h-auto w-[min(72vw,280px)] max-w-[280px] object-contain drop-shadow-[0_28px_48px_rgba(6,27,46,0.16)] sm:w-[min(64vw,300px)] sm:max-w-[300px] md:w-[320px] md:max-w-[320px]"
            />
          </div>
        </div>
      </motion.div>
    </section>
  );
}
