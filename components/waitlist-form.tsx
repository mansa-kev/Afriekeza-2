"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const waitlistSchema = z.object({
  fullName: z.string().min(2, "Please enter your full name"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().min(8, "Please enter a valid phone number"),
  country: z.string().min(2, "Please enter your country"),
  investorType: z.enum([
    "kenya-based",
    "diaspora",
    "institution",
    "chama",
    "other",
  ]),
  interest: z.enum([
    "private-credit",
    "future-equity",
    "learning",
    "diaspora-investing",
    "registry",
  ]),
  startingAmount: z.enum(["5k-25k", "25k-100k", "100k-plus"]),
  consent: z.literal(true, { message: "You must agree to continue" }),
});

type WaitlistFormData = z.infer<typeof waitlistSchema>;

const inputClass =
  "w-full rounded-xl border border-soft-border bg-white px-4 py-3 text-[15px] text-dark outline-none transition-colors focus:border-blue focus:ring-2 focus:ring-blue/20";

const labelClass = "mb-1.5 block text-sm font-medium text-dark";

export function WaitlistForm({ className }: { className?: string }) {
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<WaitlistFormData>({
    resolver: zodResolver(waitlistSchema),
  });

  const onSubmit = async (_data: WaitlistFormData) => {
    await new Promise((r) => setTimeout(r, 800));
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div
        className={cn(
          "rounded-3xl border border-soft-green bg-soft-green p-8 text-center",
          className,
        )}
      >
        <p className="text-lg font-semibold text-dark">
          Thank you. You have joined the Afriekeza investor waitlist.
        </p>
        <p className="mt-2 text-muted">
          We will contact you when investor onboarding opens in your region.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={cn(
        "rounded-3xl border border-soft-border bg-white p-8 shadow-sm",
        className,
      )}
    >
      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label className={labelClass}>Full name</label>
          <input className={inputClass} {...register("fullName")} />
          {errors.fullName && (
            <p className="mt-1 text-sm text-risk-red">{errors.fullName.message}</p>
          )}
        </div>
        <div>
          <label className={labelClass}>Email</label>
          <input type="email" className={inputClass} {...register("email")} />
          {errors.email && (
            <p className="mt-1 text-sm text-risk-red">{errors.email.message}</p>
          )}
        </div>
        <div>
          <label className={labelClass}>Phone</label>
          <input className={inputClass} {...register("phone")} />
          {errors.phone && (
            <p className="mt-1 text-sm text-risk-red">{errors.phone.message}</p>
          )}
        </div>
        <div>
          <label className={labelClass}>Country</label>
          <input className={inputClass} {...register("country")} />
          {errors.country && (
            <p className="mt-1 text-sm text-risk-red">{errors.country.message}</p>
          )}
        </div>
        <div>
          <label className={labelClass}>Investor type</label>
          <select className={inputClass} {...register("investorType")}>
            <option value="">Select type</option>
            <option value="kenya-based">Kenya-based</option>
            <option value="diaspora">Diaspora</option>
            <option value="institution">Institution</option>
            <option value="chama">Chama</option>
            <option value="other">Other</option>
          </select>
          {errors.investorType && (
            <p className="mt-1 text-sm text-risk-red">
              {errors.investorType.message}
            </p>
          )}
        </div>
        <div>
          <label className={labelClass}>Interest</label>
          <select className={inputClass} {...register("interest")}>
            <option value="">Select interest</option>
            <option value="private-credit">Private Credit</option>
            <option value="future-equity">Future Equity</option>
            <option value="learning">Learning</option>
            <option value="diaspora-investing">Diaspora Investing</option>
            <option value="registry">Registry</option>
          </select>
          {errors.interest && (
            <p className="mt-1 text-sm text-risk-red">{errors.interest.message}</p>
          )}
        </div>
        <div className="md:col-span-2">
          <label className={labelClass}>Expected starting amount</label>
          <select className={inputClass} {...register("startingAmount")}>
            <option value="">Select range</option>
            <option value="5k-25k">KES 5,000–25,000</option>
            <option value="25k-100k">KES 25,000–100,000</option>
            <option value="100k-plus">KES 100,000+</option>
          </select>
          {errors.startingAmount && (
            <p className="mt-1 text-sm text-risk-red">
              {errors.startingAmount.message}
            </p>
          )}
        </div>
        <div className="md:col-span-2">
          <label className="flex items-start gap-3">
            <input
              type="checkbox"
              className="mt-1 h-4 w-4 rounded border-soft-border text-green focus:ring-green"
              {...register("consent")}
            />
            <span className="text-sm text-muted">
              I understand that private-market opportunities carry risk,
              including loss of capital and limited liquidity. I agree to be
              contacted about Afriekeza investor onboarding.
            </span>
          </label>
          {errors.consent && (
            <p className="mt-1 text-sm text-risk-red">{errors.consent.message}</p>
          )}
        </div>
      </div>
      <Button
        type="submit"
        variant="primary"
        size="lg"
        className="mt-6 w-full md:w-auto"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Submitting..." : "Join Investor Waitlist"}
      </Button>
    </form>
  );
}
