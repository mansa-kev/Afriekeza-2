"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

type ProductShowcase = {
  id: string;
  category: string;
  name: string;
  hook: string;
  notes: string[];
  href: string;
  cta: string;
  image: string;
  imageAlt: string;
  imageClassName?: string;
  integratedBg?: boolean;
};

const creditProducts: ProductShowcase[] = [
  {
    id: "yield",
    category: "Private Credit",
    name: "Afriekeza Yield",
    hook: "Structured private credit across vetted African growth businesses.",
    notes: [
      "12-month tenor · Up to 11.8% p.a. target return",
      "Quarterly payouts · From KES 10,000 minimum",
      "Track committed capital and funding progress in real time",
    ],
    href: "/invest#yield",
    cta: "Explore Yield",
    image: "/products/afriekeza-yield-mobile-transparent.png",
    imageAlt: "Afriekeza Yield mobile dashboard showing portfolio value and target returns",
    imageClassName: "max-w-[240px] sm:max-w-[260px] lg:max-w-[280px]",
  },
  {
    id: "revenue-backed",
    category: "Private Credit",
    name: "Revenue-Backed Notes",
    hook: "Short-to-medium-term notes linked to verified business revenue.",
    notes: [
      "24-month tenor · Up to 10.25% p.a. target return",
      "Revenue-secured · Quarterly payout schedule",
      "Browse live opportunities with clear funding status",
    ],
    href: "/invest#revenue-backed",
    cta: "View opportunities",
    image: "/products/revenue-backed-notes-transparent.png",
    imageAlt: "Revenue-Backed Notes dashboard with live opportunity listings",
    imageClassName: "max-w-[520px]",
  },
  {
    id: "asset-backed",
    category: "Private Credit",
    name: "Asset-Backed Notes",
    hook: "Notes backed by identifiable assets and future receivables.",
    notes: [
      "18-month tenor · Up to 10.5% p.a. target return",
      "Medium risk · Quarterly distributions",
      "Collateral summaries and repayment schedules disclosed upfront",
    ],
    href: "/invest#asset-backed",
    cta: "View details",
    image: "/products/asset-backed-notes-transparent.png",
    imageAlt: "Asset-Backed Notes product page on tablet",
    imageClassName: "max-w-[480px]",
    integratedBg: true,
  },
  {
    id: "growth-notes",
    category: "Private Credit",
    name: "Growth Notes",
    hook: "Flexible growth capital for expansion, working capital, and delivery.",
    notes: [
      "18-month tenor · Up to 12.4% p.a. target return",
      "Allocated across expansion, inventory, and contract fulfilment",
      "Monitor capital deployment and payment schedules",
    ],
    href: "/invest#growth-notes",
    cta: "Explore Growth Notes",
    image: "/products/growth-notes-transparent.png",
    imageAlt: "Growth Notes dashboard showing capital allocation and funding progress",
    imageClassName: "max-w-[540px]",
  },
];

function ProductShowcaseRow({
  product,
  index,
}: {
  product: ProductShowcase;
  index: number;
}) {
  const imageFirst = index % 2 === 1;
  const isYield = index === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, delay: 0.04 }}
      className={cn(
        "grid items-center gap-8 md:gap-10",
        isYield
          ? "lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-6 xl:gap-10"
          : "lg:grid-cols-2 lg:gap-12 xl:gap-16",
        index % 2 === 1 && "lg:pl-10 xl:pl-16",
        index % 2 === 0 && index > 0 && "lg:pr-10 xl:pr-16",
      )}
    >
      <div
        className={cn(
          "flex flex-col justify-center",
          imageFirst ? "lg:order-2" : "lg:order-1",
          isYield && !imageFirst && "lg:pr-2",
        )}
      >
        <p className="text-[13px] font-semibold tracking-[0.14em] text-blue uppercase">
          {product.category}
        </p>
        <h3 className="font-display mt-3 text-[28px] font-bold leading-tight tracking-tight text-navy md:text-[34px]">
          {product.name}
        </h3>
        <p className="mt-4 text-[17px] leading-relaxed text-muted">
          {product.hook}
        </p>
        <ul className="mt-6 space-y-3">
          {product.notes.map((note) => (
            <li
              key={note}
              className="flex gap-3 text-[15px] leading-relaxed text-dark"
            >
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-green" />
              {note}
            </li>
          ))}
        </ul>
        <Link
          href={product.href}
          className="group mt-8 inline-flex items-center gap-2 text-[15px] font-semibold text-blue transition-colors hover:text-navy"
        >
          {product.cta}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>

      <figure
        className={cn(
          "relative flex shrink-0 justify-center",
          imageFirst ? "lg:order-1 lg:justify-start" : "lg:order-2 lg:justify-end",
          isYield && "lg:justify-end",
          product.integratedBg && "bg-off-white",
        )}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-[4%] left-1/2 h-10 w-[65%] -translate-x-1/2 rounded-full bg-navy/[0.05] blur-2xl"
        />
        <Image
          src={product.image}
          alt={product.imageAlt}
          width={1024}
          height={768}
          sizes={isYield ? "(max-width: 1024px) 60vw, 280px" : "(max-width: 1024px) 90vw, 520px"}
          unoptimized
          className={cn(
            "relative z-[1] h-auto w-full object-contain",
            product.integratedBg
              ? "drop-shadow-[0_20px_36px_rgba(6,27,46,0.08)]"
              : isYield
                ? "drop-shadow-[0_20px_40px_rgba(6,27,46,0.1)]"
                : "drop-shadow-[0_24px_48px_rgba(6,27,46,0.12)]",
            product.imageClassName,
          )}
        />
      </figure>
    </motion.div>
  );
}

function FutureEquityCompact() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.45 }}
      className="mt-10 lg:mt-12"
    >
      <div className="flex flex-col gap-6 rounded-2xl border border-dashed border-soft-border bg-off-white p-6 sm:flex-row sm:items-center sm:gap-8 md:p-7">
        <div className="relative mx-auto w-full max-w-[180px] shrink-0 sm:mx-0">
          <Image
            src="/products/future-equity-transparent.png"
            alt="Future Equity Opportunities dashboard preview"
            width={400}
            height={300}
            unoptimized
            className="h-auto w-full object-contain"
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-xs font-semibold tracking-[0.14em] text-muted uppercase">
              Private Equity
            </p>
            <span className="inline-flex items-center gap-1 rounded-full bg-navy/8 px-2.5 py-0.5 text-xs font-medium text-navy">
              <Clock className="h-3 w-3" />
              Coming later
            </span>
          </div>
          <h3 className="mt-2 text-lg font-bold text-dark">
            Future Equity Opportunities
          </h3>
          <p className="mt-1.5 text-sm leading-relaxed text-muted">
            Convertible and equity pathways for qualified businesses · Target
            IRR 18.5%+ · Join the waitlist for early access
          </p>
          <Link
            href="/invest#waitlist"
            className="group mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-blue hover:text-navy"
          >
            Join waitlist
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

export function InvestmentProductsSection() {
  return (
    <section className="overflow-hidden bg-off-white py-20 md:py-28 lg:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-3xl text-center"
        >
          <p className="font-display mb-4 text-[13px] font-semibold tracking-[0.18em] text-blue uppercase">
            Investment Products
          </p>
          <h2 className="font-display text-[32px] font-bold leading-tight tracking-tight text-navy md:text-[46px]">
            Build wealth beyond the usual options.
          </h2>
        </motion.div>

        <div className="mt-16 space-y-20 md:mt-20 md:space-y-24 lg:space-y-28">
          {creditProducts.map((product, index) => (
            <ProductShowcaseRow
              key={product.id}
              product={product}
              index={index}
            />
          ))}
          <FutureEquityCompact />
        </div>

        <p className="mx-auto mt-12 max-w-2xl text-center text-xs leading-relaxed text-muted lg:mt-16">
          Target returns are illustrative and not guaranteed. Private-market
          opportunities carry risk, including loss of capital.
        </p>
      </div>
    </section>
  );
}
