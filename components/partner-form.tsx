"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const partnerSchema = z.object({
  name: z.string().min(2, "Please enter your name"),
  organization: z.string().min(2, "Please enter your organization"),
  role: z.string().min(2, "Please enter your role"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().min(8, "Please enter a valid phone number"),
  partnerType: z.string().min(2, "Please select partner type"),
  message: z.string().min(10, "Please provide a brief message"),
});

type PartnerFormData = z.infer<typeof partnerSchema>;

const inputClass =
  "w-full rounded-xl border border-soft-border bg-white px-4 py-3 text-[15px] text-dark outline-none transition-colors focus:border-blue focus:ring-2 focus:ring-blue/20";

const labelClass = "mb-1.5 block text-sm font-medium text-dark";

export function PartnerForm({ className }: { className?: string }) {
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PartnerFormData>({
    resolver: zodResolver(partnerSchema),
  });

  const onSubmit = async (_data: PartnerFormData) => {
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
          Thank you. We have received your partnership enquiry.
        </p>
        <p className="mt-2 text-muted">
          Our partnerships team will be in touch shortly.
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
          <label className={labelClass}>Name</label>
          <input className={inputClass} {...register("name")} />
          {errors.name && (
            <p className="mt-1 text-sm text-risk-red">{errors.name.message}</p>
          )}
        </div>
        <div>
          <label className={labelClass}>Organization</label>
          <input className={inputClass} {...register("organization")} />
          {errors.organization && (
            <p className="mt-1 text-sm text-risk-red">
              {errors.organization.message}
            </p>
          )}
        </div>
        <div>
          <label className={labelClass}>Role</label>
          <input className={inputClass} {...register("role")} />
          {errors.role && (
            <p className="mt-1 text-sm text-risk-red">{errors.role.message}</p>
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
          <label className={labelClass}>Partner type</label>
          <select className={inputClass} {...register("partnerType")}>
            <option value="">Select type</option>
            <option value="bank">Bank</option>
            <option value="custodian">Custodian & Trustee</option>
            <option value="law-firm">Law Firm</option>
            <option value="dfi">DFI & Impact Investor</option>
            <option value="diaspora">Diaspora Group</option>
            <option value="accelerator">Accelerator</option>
            <option value="other">Other</option>
          </select>
          {errors.partnerType && (
            <p className="mt-1 text-sm text-risk-red">
              {errors.partnerType.message}
            </p>
          )}
        </div>
        <div className="md:col-span-2">
          <label className={labelClass}>Message</label>
          <textarea rows={4} className={inputClass} {...register("message")} />
          {errors.message && (
            <p className="mt-1 text-sm text-risk-red">
              {errors.message.message}
            </p>
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
        {isSubmitting ? "Submitting..." : "Submit Partnership Enquiry"}
      </Button>
    </form>
  );
}
