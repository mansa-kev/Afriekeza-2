"use client";

import { motion } from "framer-motion";
import {
  BarChart3,
  Briefcase,
  ClipboardList,
  FileText,
  Users,
} from "lucide-react";

const stepIcons = {
  Briefcase,
  ClipboardList,
  BarChart3,
  Users,
  FileText,
} as const;

export type StepCardIcon = keyof typeof stepIcons;

type StepCardProps = {
  step: number;
  title: string;
  description: string;
  icon: StepCardIcon;
  index?: number;
  isLast?: boolean;
};

export function StepCard({
  step,
  title,
  description,
  icon,
  index = 0,
  isLast = false,
}: StepCardProps) {
  const Icon = stepIcons[icon];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="relative flex flex-col items-center text-center md:flex-1"
    >
      <div className="relative flex flex-col items-center">
        <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full border-2 border-navy bg-white shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green text-sm font-bold text-white">
            {step}
          </div>
        </div>
        <div className="mt-3 flex h-10 w-10 items-center justify-center rounded-full bg-soft-blue text-blue">
          <Icon className="h-5 w-5" />
        </div>
        {!isLast && (
          <div className="absolute top-7 left-[calc(50%+28px)] hidden h-0.5 w-[calc(100%+2rem)] bg-navy/20 md:block" />
        )}
      </div>
      <h3 className="mt-4 text-lg font-semibold text-dark">{title}</h3>
      <p className="mt-2 max-w-[200px] text-[15px] leading-relaxed text-muted">
        {description}
      </p>
    </motion.div>
  );
}
