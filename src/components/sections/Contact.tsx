"use client";

import { useId, useState } from "react";
import { AnimatePresence, m } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Section } from "@/components/layout/Section";
import { Reveal } from "@/components/layout/Reveal";
import { contact } from "@/content/site";
import { inquirySchema, type InquiryInput } from "@/lib/inquiry-schema";
import { EASE_EMPHASIZED, EASE_STANDARD } from "@/lib/motion";
import { track } from "@/lib/track";

/* -- Bottom-bordered field with a focus aurora sweep. --------------- */
function Field({
  label,
  id,
  type = "text",
  placeholder,
  error,
  register,
  required,
  inputMode,
}: {
  label: string;
  id: string;
  type?: string;
  placeholder?: string;
  error?: string;
  register: ReturnType<typeof useForm<InquiryInput>>["register"];
  required?: boolean;
  inputMode?: "text" | "email" | "url" | "numeric";
}) {
  const name = id as keyof InquiryInput;
  return (
    <div className="relative pt-7">
      <label
        htmlFor={id}
        className="eyebrow absolute left-0 top-0 text-fg-tertiary"
      >
        {label}
        {!required && <span className="ml-2 text-fg-quaternary">Optional</span>}
      </label>
      <input
        id={id}
        type={type}
        inputMode={inputMode}
        placeholder={placeholder}
        aria-invalid={error ? "true" : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className="peer w-full bg-transparent pb-3 font-text text-body-lg text-fg-primary outline-none placeholder:text-fg-quaternary"
        {...register(name)}
      />
      <span className="absolute bottom-0 left-0 h-px w-full bg-border-strong" />
      <span className="absolute bottom-0 left-0 h-[2px] w-full origin-left scale-x-0 bg-gradient-to-r from-aurora-1 via-aurora-2 to-aurora-3 transition-transform duration-200 ease-standard peer-focus:scale-x-100" />
      {error && (
        <p
          id={`${id}-error`}
          role="alert"
          className="mt-2 text-[12px] text-aurora-3"
        >
          {error}
        </p>
      )}
    </div>
  );
}

export function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const checkId = useId();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<InquiryInput>({
    resolver: zodResolver(inquirySchema),
    defaultValues: {
      fullName: "",
      company: "",
      role: "",
      website: "",
      email: "",
      fax: "",
      humanCheck: "",
    },
  });

  const onSubmit = async (data: InquiryInput) => {
    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = (await res.json()) as {
        ok: boolean;
        errors?: Record<string, string>;
      };
      if (json.ok) {
        track("inquiry_submitted", { company: data.company });
        setSubmitted(true);
        return;
      }
      for (const [key, message] of Object.entries(json.errors ?? {})) {
        setError(key === "_form" ? "root" : (key as keyof InquiryInput), {
          message,
        });
      }
    } catch {
      setError("root", { message: "Network error. Please try again." });
    }
  };

  return (
    <Section
      id="contact"
      track="contact"
      scene={false}
      rhythm="lg"
      className="bg-bg-base"
    >
      <div className="container-x grid gap-16 md:grid-cols-2 md:gap-24">
        {/* Left — heading */}
        <div className="md:pt-7">
          <Reveal>
            <p className="eyebrow">{contact.eyebrow}</p>
          </Reveal>
          <Reveal delay={0.06}>
            <h2 className="mt-6 max-w-[18ch] font-display text-[clamp(30px,4.5vw,56px)] font-medium leading-[1.08] tracking-[-0.035em] text-fg-primary">
              {contact.title}
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mt-6 max-w-[42ch] text-body-lg text-fg-secondary">
              {contact.subhead}
            </p>
          </Reveal>
        </div>

        {/* Right — form / success crossfade */}
        <div className="relative">
          <AnimatePresence mode="wait">
            {submitted ? (
              <m.div
                key="success"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: EASE_EMPHASIZED }}
              >
                <span className="block h-px w-20 bg-aurora-2" />
                <h3 className="mt-10 font-display text-headline-lg font-medium tracking-[-0.02em] text-fg-primary">
                  {contact.success.title}
                </h3>
                <p className="mt-4 max-w-[40ch] text-body-lg text-fg-secondary">
                  {contact.success.subhead}
                </p>
              </m.div>
            ) : (
              <m.form
                key="form"
                noValidate
                onSubmit={handleSubmit(onSubmit)}
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, ease: EASE_STANDARD }}
                className="flex flex-col gap-2"
              >
                <Field
                  label="Full Name"
                  id="fullName"
                  required
                  placeholder="Jane Founder"
                  register={register}
                  error={errors.fullName?.message}
                />
                <Field
                  label="Company Name"
                  id="company"
                  required
                  placeholder="Acme Inc."
                  register={register}
                  error={errors.company?.message}
                />
                <Field
                  label="Role"
                  id="role"
                  required
                  placeholder="Co-founder & CEO"
                  register={register}
                  error={errors.role?.message}
                />
                <Field
                  label="Website"
                  id="website"
                  type="url"
                  inputMode="url"
                  placeholder="https://"
                  register={register}
                  error={errors.website?.message}
                />
                <Field
                  label="Email"
                  id="email"
                  type="email"
                  inputMode="email"
                  required
                  placeholder="jane@acme.com"
                  register={register}
                  error={errors.email?.message}
                />

                {/* Honeypot — off-screen, never shown to humans. */}
                <div
                  aria-hidden
                  className="absolute left-[-9999px] top-0 h-0 w-0 overflow-hidden"
                >
                  <label htmlFor="fax">Fax</label>
                  <input
                    id="fax"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    {...register("fax")}
                  />
                </div>

                {/* Cognitive check */}
                <div className="relative pt-7">
                  <label htmlFor={checkId} className="eyebrow text-fg-tertiary">
                    Verify you are human
                  </label>
                  <div className="mt-4 flex items-center gap-4">
                    <svg
                      width="84"
                      height="34"
                      viewBox="0 0 84 34"
                      aria-hidden="true"
                      className="shrink-0"
                    >
                      <rect
                        width="84"
                        height="34"
                        rx="6"
                        fill="rgba(255,255,255,0.03)"
                        stroke="var(--border-subtle)"
                      />
                      <text
                        x="42"
                        y="23"
                        textAnchor="middle"
                        fill="var(--fg-secondary)"
                        fontSize="16"
                        fontFamily="var(--font-display)"
                        letterSpacing="1"
                      >
                        2 + 3 =
                      </text>
                    </svg>
                    <input
                      id={checkId}
                      type="text"
                      inputMode="numeric"
                      aria-label="What is two plus three?"
                      aria-invalid={errors.humanCheck ? "true" : undefined}
                      className="peer w-24 bg-transparent pb-2 font-text text-body-lg text-fg-primary outline-none placeholder:text-fg-quaternary"
                      placeholder="?"
                      {...register("humanCheck")}
                    />
                  </div>
                  {errors.humanCheck && (
                    <p role="alert" className="mt-2 text-[12px] text-aurora-3">
                      {errors.humanCheck.message}
                    </p>
                  )}
                </div>

                {errors.root && (
                  <p role="alert" className="mt-4 text-[13px] text-aurora-3">
                    {errors.root.message}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  data-cursor-hover
                  className="group relative mt-10 h-14 overflow-hidden rounded-[2px] border border-border-strong text-[13px] uppercase tracking-[0.16em] text-fg-primary transition-colors duration-[240ms] ease-standard hover:text-bg-base disabled:opacity-50"
                >
                  <span
                    aria-hidden
                    className="absolute inset-0 origin-left scale-x-0 bg-fg-primary transition-transform duration-[240ms] ease-standard group-hover:scale-x-100"
                  />
                  <span className="relative">
                    {isSubmitting ? "Sending…" : contact.cta}
                  </span>
                </button>
              </m.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </Section>
  );
}
