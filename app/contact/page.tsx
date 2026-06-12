"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, Phone, MapPin } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { SectionHeader } from "@/components/section-header";
import { Button } from "@/components/ui/button";
import { PartnerForm } from "@/components/partner-form";

const contactSchema = z.object({
  name: z.string().min(2, "Please enter your name"),
  email: z.string().email("Please enter a valid email"),
  enquiryType: z.enum(["investor", "business", "partner", "general"]),
  message: z.string().min(10, "Please enter your message"),
});

type ContactFormData = z.infer<typeof contactSchema>;

const inputClass =
  "w-full rounded-xl border border-soft-border bg-white px-4 py-3 text-[15px] text-dark outline-none transition-colors focus:border-blue focus:ring-2 focus:ring-blue/20";

const labelClass = "mb-1.5 block text-sm font-medium text-dark";

function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (_data: ContactFormData) => {
    await new Promise((r) => setTimeout(r, 800));
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="rounded-3xl border border-soft-green bg-soft-green p-8 text-center">
        <p className="text-lg font-semibold text-dark">
          Thank you. We have received your message.
        </p>
        <p className="mt-2 text-muted">Our team will respond within 2 business days.</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="rounded-3xl border border-soft-border bg-white p-8 shadow-sm"
    >
      <div className="grid gap-5">
        <div>
          <label className={labelClass}>Name</label>
          <input className={inputClass} {...register("name")} />
          {errors.name && (
            <p className="mt-1 text-sm text-risk-red">{errors.name.message}</p>
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
          <label className={labelClass}>Enquiry type</label>
          <select className={inputClass} {...register("enquiryType")}>
            <option value="">Select type</option>
            <option value="investor">Investor enquiry</option>
            <option value="business">Business enquiry</option>
            <option value="partner">Partner enquiry</option>
            <option value="general">General enquiry</option>
          </select>
          {errors.enquiryType && (
            <p className="mt-1 text-sm text-risk-red">
              {errors.enquiryType.message}
            </p>
          )}
        </div>
        <div>
          <label className={labelClass}>Message</label>
          <textarea rows={5} className={inputClass} {...register("message")} />
          {errors.message && (
            <p className="mt-1 text-sm text-risk-red">{errors.message.message}</p>
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
        {isSubmitting ? "Sending..." : "Send Message"}
      </Button>
    </form>
  );
}

export default function ContactPage() {
  return (
    <>
      <PageHero
        headline="Get in touch with Afriekeza."
        subheadline="Whether you are an investor, business, or institutional partner — we are here to help."
      />

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-12 lg:grid-cols-3">
            <div className="space-y-6">
              <div className="rounded-3xl border border-soft-border bg-white p-6">
                <Mail className="h-5 w-5 text-blue" />
                <h3 className="mt-3 font-semibold text-dark">Investor enquiries</h3>
                <p className="mt-2 text-sm text-muted">
                  Questions about private-market access, onboarding, or opportunities.
                </p>
              </div>
              <div className="rounded-3xl border border-soft-border bg-white p-6">
                <Phone className="h-5 w-5 text-green" />
                <h3 className="mt-3 font-semibold text-dark">Business enquiries</h3>
                <p className="mt-2 text-sm text-muted">
                  Questions about raising capital, issuer requirements, or registry.
                </p>
              </div>
              <div className="rounded-3xl border border-soft-border bg-white p-6">
                <MapPin className="h-5 w-5 text-blue" />
                <h3 className="mt-3 font-semibold text-dark">Partner enquiries</h3>
                <p className="mt-2 text-sm text-muted">
                  Institutional partnerships, collaborations, and integrations.
                </p>
              </div>
              <div className="rounded-3xl border border-soft-border bg-off-white p-6">
                <p className="text-sm font-semibold text-dark">Contact details</p>
                <div className="mt-3 space-y-2 text-sm text-muted">
                  <p>www.afriekeza.com</p>
                  <p>+254 726 391 916</p>
                  <p>Nairobi, Kenya</p>
                </div>
              </div>
            </div>
            <div className="lg:col-span-2">
              <SectionHeader
                headline="Contact form"
                subheadline="Send us a message and we will get back to you."
                align="left"
              />
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-off-white py-20">
        <div className="mx-auto max-w-3xl px-6">
          <SectionHeader headline="Institutional partnership enquiry" />
          <PartnerForm className="mt-10" />
        </div>
      </section>
    </>
  );
}
