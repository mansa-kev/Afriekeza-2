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

      {/* ADDX-style integrated stage: panel + embedded logo + phone */}
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.75, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-20 mx-auto mt-10 w-full max-w-[1240px] px-3 md:mt-14 md:px-6 lg:mt-16"
      >
        {/* Phone extends above panel; hand meets panel floor */}
        <div className="relative h-[min(62vw,460px)] sm:h-[min(54vw,440px)] md:h-[460px] lg:h-[490px]">
          {/* Rounded visual panel — wider and taller */}
          <div
            aria-hidden
            className="absolute inset-x-[-0.5rem] bottom-0 h-[min(42vw,230px)] overflow-hidden rounded-[2rem] border border-white/70 shadow-[0_32px_90px_-42px_rgba(6,27,46,0.2)] sm:inset-x-[-0.75rem] sm:h-[260px] md:inset-x-[-1rem] md:h-[300px] md:rounded-[2.5rem] lg:h-[330px]"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-[#f8fafc] via-stage to-[#e4ebf2]" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,_rgba(20,119,201,0.09),_transparent_62%)]" />
            <div className="absolute inset-x-0 top-0 h-px bg-white/90" />

            {/* Embedded brand logo — edge-to-edge within panel */}
            <div className="absolute inset-0 flex items-center justify-center px-2 py-1 sm:px-3 sm:py-1.5 md:px-4 md:py-2">
              <Image
                src="/afriekeza-logo-transparent.png"
                alt=""
                width={2951}
                height={973}
                aria-hidden
                className="h-auto w-full max-w-full object-contain opacity-[0.22] md:opacity-[0.26] lg:opacity-[0.3]"
              />
            </div>
          </div>

          {/* Contact shadow where phone meets the stage surface */}
          <div
            aria-hidden
            className="pointer-events-none absolute bottom-[min(5vw,30px)] left-1/2 z-[2] h-5 w-[min(48vw,210px)] -translate-x-1/2 rounded-full bg-navy/[0.08] blur-xl sm:bottom-[34px] md:bottom-[38px] md:h-6 md:w-[220px]"
          />

          {/* Phone — transparent asset, no white halo */}
          <div className="absolute inset-x-0 bottom-0 z-[3] flex justify-center">
            <Image
              src="/hero-phone-mockup-transparent.png"
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
