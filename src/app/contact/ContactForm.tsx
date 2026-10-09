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
  "w-full bg-transparent border-b border-foam/25 py-3 text-base text-white placeholder-foam/40 hover:border-foam/45 focus:outline-none focus-visible:outline-none focus:border-cyan transition-colors";

const labelClass = "label-mono block mb-2";

const errorClass = "mt-2 text-xs text-amber";

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
        <p className="label-mono !text-cyan mb-4">
          Transmission received.
        </p>
        <p className="text-body text-lg max-w-sm leading-relaxed">
          We&apos;ll be in touch. You can also reach us at{" "}
          <a href="mailto:andrew@nobledeepsea.com" className="text-white underline decoration-foam/40 underline-offset-4 hover:text-cyan transition-colors">
            andrew@nobledeepsea.com
          </a>
          .
        </p>
        <button
          onClick={() => setSubmitted(false)}
          className="mt-8 text-xs uppercase tracking-[0.15em] text-muted hover:text-white transition-colors"
        >
          Send another →
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-8">
      <div className="grid sm:grid-cols-2 gap-8">
        <div>
          <label htmlFor="cf-name" className={labelClass}>Name *</label>
          <input
            id="cf-name"
            aria-invalid={!!errors.name}
            {...register("name", { required: true })}
            placeholder="Your name"
            className={`${inputClass} ${errors.name ? "border-amber/70" : ""}`}
          />
          {errors.name && <p className={errorClass}>Please enter your name.</p>}
        </div>
        <div>
          <label htmlFor="cf-email" className={labelClass}>Email *</label>
          <input
            id="cf-email"
            aria-invalid={!!errors.email}
            {...register("email", {
              required: true,
              pattern: /^\S+@\S+\.\S+$/,
            })}
            type="email"
            placeholder="you@company.com"
            className={`${inputClass} ${errors.email ? "border-amber/70" : ""}`}
          />
          {errors.email && <p className={errorClass}>Please enter a valid email address.</p>}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-8">
        <div>
          <label htmlFor="cf-company" className={labelClass}>Company</label>
          <input id="cf-company" {...register("company")} placeholder="Your company" className={inputClass} />
        </div>
        <div>
          <label htmlFor="cf-role" className={labelClass}>Role</label>
          <input id="cf-role" {...register("role")} placeholder="e.g. Head of Integrity" className={inputClass} />
        </div>
      </div>

      <div>
        <label htmlFor="cf-message" className={labelClass}>Message *</label>
        <textarea
          id="cf-message"
          aria-invalid={!!errors.message}
          {...register("message", { required: true })}
          rows={5}
          placeholder="Tell us about your infrastructure, your monitoring challenges, or how you'd like to work together."
          className={`${inputClass} resize-none ${errors.message ? "border-amber/70" : ""}`}
        />
        {errors.message && <p className={errorClass}>Please include a message.</p>}
      </div>

      <div>
        <button
          type="submit"
          disabled={submitting}
          className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {submitting ? "Sending…" : "Send Message"}
          {!submitting && (
            <svg aria-hidden className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          )}
        </button>
      </div>
    </form>
  );
}
