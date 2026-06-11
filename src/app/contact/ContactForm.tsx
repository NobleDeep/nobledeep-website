"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";

interface FormValues {
  name: string;
  email: string;
  company: string;
  role: string;
  message: string;
}

const inputClass =
  "w-full bg-transparent border-b border-[#90e0ef]/20 py-3 text-sm text-white placeholder-[#90e0ef]/30 focus:outline-none focus:border-[#22d3ee]/60 transition-colors";

const labelClass =
  "block text-[10px] font-semibold uppercase tracking-[0.2em] text-[#90e0ef]/50 mb-2";

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>();

  const onSubmit = async (data: FormValues) => {
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 800));
    console.log("Form submission:", data);
    setSubmitting(false);
    setSubmitted(true);
    reset();
  };

  if (submitted) {
    return (
      <div className="py-16">
        <p
          className="text-xs font-semibold uppercase tracking-[0.2em] text-[#22d3ee] mb-4"
          style={{ textShadow: "0 0 20px rgba(34,211,238,0.4)" }}
        >
          Transmission received.
        </p>
        <p className="text-[#90e0ef] text-base max-w-sm leading-relaxed">
          We&apos;ll be in touch. You can also reach us at{" "}
          <a href="mailto:andrew@nobledeepsea.com" className="text-white hover:text-[#22d3ee] transition-colors">
            andrew@nobledeepsea.com
          </a>
          .
        </p>
        <button
          onClick={() => setSubmitted(false)}
          className="mt-8 text-xs uppercase tracking-[0.15em] text-[#90e0ef]/40 hover:text-[#90e0ef] transition-colors"
        >
          Send another →
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8">
      <div className="grid sm:grid-cols-2 gap-8">
        <div>
          <label className={labelClass}>Name *</label>
          <input
            {...register("name", { required: true })}
            placeholder="Your name"
            className={`${inputClass} ${errors.name ? "border-red-400/50" : ""}`}
          />
        </div>
        <div>
          <label className={labelClass}>Email *</label>
          <input
            {...register("email", {
              required: true,
              pattern: /^\S+@\S+\.\S+$/,
            })}
            type="email"
            placeholder="you@company.com"
            className={`${inputClass} ${errors.email ? "border-red-400/50" : ""}`}
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-8">
        <div>
          <label className={labelClass}>Company</label>
          <input {...register("company")} placeholder="Your company" className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Role</label>
          <input {...register("role")} placeholder="e.g. Head of Integrity" className={inputClass} />
        </div>
      </div>

      <div>
        <label className={labelClass}>Message *</label>
        <textarea
          {...register("message", { required: true })}
          rows={5}
          placeholder="Tell us about your infrastructure, your monitoring challenges, or how you'd like to work together."
          className={`${inputClass} resize-none ${errors.message ? "border-red-400/50" : ""}`}
        />
      </div>

      <div>
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center gap-3 border border-[#90e0ef]/30 px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.15em] text-white transition-all hover:border-[#22d3ee]/60 hover:text-[#22d3ee] disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ boxShadow: "0 0 20px rgba(0,119,182,0.15)" }}
        >
          {submitting ? "Sending…" : "Send Message"}
          {!submitting && (
            <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          )}
        </button>
      </div>
    </form>
  );
}
