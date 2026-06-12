"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const businessSchema = z.object({
  companyName: z.string().min(2, "Please enter your company name"),
  founderName: z.string().min(2, "Please enter founder name"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().min(8, "Please enter a valid phone number"),
  industry: z.string().min(2, "Please enter your industry"),
  location: z.string().min(2, "Please enter your location"),
  yearsOperating: z.string().min(1, "Required"),
  annualRevenue: z.string().min(1, "Required"),
  raiseAmount: z.string().min(1, "Required"),
  useOfFunds: z.string().min(10, "Please describe how funds will be used"),
  hasFinancialStatements: z.enum(["yes", "no"]),
  hasTaxCompliance: z.enum(["yes", "no"]),
  description: z.string().min(20, "Please provide a brief business description"),
  consent: z.literal(true, { message: "You must agree to continue" }),
});

type BusinessFormData = z.infer<typeof businessSchema>;

const inputClass =
  "w-full rounded-xl border border-soft-border bg-white px-4 py-3 text-[15px] text-dark outline-none transition-colors focus:border-blue focus:ring-2 focus:ring-blue/20";

const labelClass = "mb-1.5 block text-sm font-medium text-dark";

export function BusinessApplicationForm({ className }: { className?: string }) {
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<BusinessFormData>({
    resolver: zodResolver(businessSchema),
  });

  const onSubmit = async (_data: BusinessFormData) => {
    await new Promise((r) => setTimeout(r, 800));
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div
        className={cn(
          "rounded-3xl border border-soft-blue bg-soft-blue p-8 text-center",
          className,
        )}
      >
        <p className="text-lg font-semibold text-dark">
          Thank you. Afriekeza has received your business application.
        </p>
        <p className="mt-2 text-muted">
          Our team will review your submission and respond within 5 business
          days.
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
          <label className={labelClass}>Company name</label>
          <input className={inputClass} {...register("companyName")} />
          {errors.companyName && (
            <p className="mt-1 text-sm text-risk-red">
              {errors.companyName.message}
            </p>
          )}
        </div>
        <div>
          <label className={labelClass}>Founder name</label>
          <input className={inputClass} {...register("founderName")} />
          {errors.founderName && (
            <p className="mt-1 text-sm text-risk-red">
              {errors.founderName.message}
            </p>
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
          <label className={labelClass}>Industry</label>
          <input className={inputClass} {...register("industry")} />
          {errors.industry && (
            <p className="mt-1 text-sm text-risk-red">
              {errors.industry.message}
            </p>
          )}
        </div>
        <div>
          <label className={labelClass}>Location</label>
          <input className={inputClass} {...register("location")} />
          {errors.location && (
            <p className="mt-1 text-sm text-risk-red">
              {errors.location.message}
            </p>
          )}
        </div>
        <div>
          <label className={labelClass}>Years operating</label>
          <input className={inputClass} {...register("yearsOperating")} />
          {errors.yearsOperating && (
            <p className="mt-1 text-sm text-risk-red">
              {errors.yearsOperating.message}
            </p>
          )}
        </div>
        <div>
          <label className={labelClass}>Approximate annual revenue</label>
          <input className={inputClass} {...register("annualRevenue")} />
          {errors.annualRevenue && (
            <p className="mt-1 text-sm text-risk-red">
              {errors.annualRevenue.message}
            </p>
          )}
        </div>
        <div>
          <label className={labelClass}>Amount you want to raise</label>
          <input className={inputClass} {...register("raiseAmount")} />
          {errors.raiseAmount && (
            <p className="mt-1 text-sm text-risk-red">
              {errors.raiseAmount.message}
            </p>
          )}
        </div>
        <div>
          <label className={labelClass}>Financial statements?</label>
          <select className={inputClass} {...register("hasFinancialStatements")}>
            <option value="">Select</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
          {errors.hasFinancialStatements && (
            <p className="mt-1 text-sm text-risk-red">
              {errors.hasFinancialStatements.message}
            </p>
          )}
        </div>
        <div>
          <label className={labelClass}>Tax compliance documents?</label>
          <select className={inputClass} {...register("hasTaxCompliance")}>
            <option value="">Select</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
          {errors.hasTaxCompliance && (
            <p className="mt-1 text-sm text-risk-red">
              {errors.hasTaxCompliance.message}
            </p>
          )}
        </div>
        <div className="md:col-span-2">
          <label className={labelClass}>Use of funds</label>
          <textarea
            rows={3}
            className={inputClass}
            {...register("useOfFunds")}
          />
          {errors.useOfFunds && (
            <p className="mt-1 text-sm text-risk-red">
              {errors.useOfFunds.message}
            </p>
          )}
        </div>
        <div className="md:col-span-2">
          <label className={labelClass}>Short business description</label>
          <textarea
            rows={4}
            className={inputClass}
            {...register("description")}
          />
          {errors.description && (
            <p className="mt-1 text-sm text-risk-red">
              {errors.description.message}
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
              I confirm the information provided is accurate and agree to be
              contacted about Afriekeza&apos;s business review process.
            </span>
          </label>
          {errors.consent && (
            <p className="mt-1 text-sm text-risk-red">{errors.consent.message}</p>
          )}
        </div>
      </div>
      <Button
        type="submit"
        variant="secondary"
        size="lg"
        className="mt-6 w-full md:w-auto"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Submitting..." : "Apply as a Business"}
      </Button>
    </form>
  );
}
