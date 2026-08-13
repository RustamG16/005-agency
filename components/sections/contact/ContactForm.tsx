"use client";

import { useId, useRef, useState, type FormEvent, type ReactNode } from "react";
import { projectTypes, budgetRanges } from "@/content/contact";
import {
  initialInquiryValues,
  validateInquiry,
  type InquiryErrors,
  type InquiryValues,
} from "./inquiry";
import styles from "./ContactForm.module.css";

type ContactFormProps = { variant?: "full" | "compact" };
type SubmitState = "idle" | "pending" | "success" | "error";

export function ContactForm({ variant = "full" }: ContactFormProps) {
  const [values, setValues] = useState<InquiryValues>(initialInquiryValues);
  const [errors, setErrors] = useState<InquiryErrors>({});
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [statusMessage, setStatusMessage] = useState("");
  const idPrefix = useId();
  const formRef = useRef<HTMLFormElement>(null);

  function update<K extends keyof InquiryValues>(key: K, value: InquiryValues[K]) {
    setValues((current) => ({ ...current, [key]: value }));
    if (errors[key]) setErrors((current) => ({ ...current, [key]: undefined }));
  }

  function focusFirstError(nextErrors: InquiryErrors) {
    const first = Object.keys(nextErrors)[0];
    if (!first) return;
    requestAnimationFrame(() => formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus());
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validateInquiry(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setSubmitState("error");
      setStatusMessage("Check the highlighted fields and try again.");
      focusFirstError(nextErrors);
      return;
    }

    setSubmitState("pending");
    setStatusMessage("Sending your inquiry…");
    try {
      const response = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const result = (await response.json()) as {
        delivered?: boolean;
        message?: string;
        errors?: InquiryErrors;
      };
      if (response.ok && result.delivered === true) {
        setSubmitState("success");
        setStatusMessage("Your inquiry was delivered. We’ll reply personally.");
        return;
      }
      if (result.errors) {
        setErrors(result.errors);
        focusFirstError(result.errors);
      }
      setSubmitState("error");
      setStatusMessage(result.message ?? "Delivery failed. Retry, or email hello@convenium.studio directly.");
    } catch {
      setSubmitState("error");
      setStatusMessage("The network request failed. Retry, or use the fallback email below.");
    }
  }

  const errorFor = (key: keyof InquiryValues) =>
    errors[key] ? <p id={`${idPrefix}-${key}-error`} className={styles.error}>{errors[key]}</p> : null;

  const messageField: ReactNode = (
    <div className={styles.field}>
      <label htmlFor={`${idPrefix}-message`} className={styles.label}>
        {variant === "compact" ? "What should feel different?" : "Message"}
      </label>
      <textarea
        id={`${idPrefix}-message`}
        name="message"
        className={styles.textarea}
        rows={variant === "compact" ? 4 : 5}
        placeholder={variant === "compact" ? "Begin with one sentence, then add the context that matters." : undefined}
        value={values.message}
        onChange={(event) => update("message", event.target.value)}
        aria-invalid={Boolean(errors.message)}
        aria-describedby={errors.message ? `${idPrefix}-message-error` : undefined}
      />
      {errorFor("message")}
    </div>
  );

  if (submitState === "success") {
    return (
      <div className={`${styles.success} ${variant === "compact" ? styles.compactSuccess : ""}`} role="status">
        <p className={styles.successHeading}>Inquiry delivered.</p>
        <p className={styles.successBody}>{statusMessage}</p>
      </div>
    );
  }

  return (
    <form ref={formRef} className={`${styles.form} ${variant === "compact" ? styles.compact : ""}`} onSubmit={handleSubmit} noValidate data-form-variant={variant}>
      {variant === "compact" && messageField}
      <div className={styles.row}>
        <div className={styles.field}>
          <label htmlFor={`${idPrefix}-name`} className={styles.label}>Name</label>
          <input id={`${idPrefix}-name`} name="name" className={styles.input} type="text" autoComplete="name" value={values.name} onChange={(event) => update("name", event.target.value)} aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? `${idPrefix}-name-error` : undefined} />
          {errorFor("name")}
        </div>
        <div className={styles.field}>
          <label htmlFor={`${idPrefix}-email`} className={styles.label}>Email</label>
          <input id={`${idPrefix}-email`} name="email" className={styles.input} type="email" autoComplete="email" value={values.email} onChange={(event) => update("email", event.target.value)} aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? `${idPrefix}-email-error` : undefined} />
          {errorFor("email")}
        </div>
      </div>
      {variant === "full" && (
        <div className={styles.field}>
          <label htmlFor={`${idPrefix}-company`} className={styles.label}>Company <span className={styles.optional}>(optional)</span></label>
          <input id={`${idPrefix}-company`} name="company" className={styles.input} type="text" autoComplete="organization" value={values.company} onChange={(event) => update("company", event.target.value)} aria-invalid={Boolean(errors.company)} aria-describedby={errors.company ? `${idPrefix}-company-error` : undefined} />
          {errorFor("company")}
        </div>
      )}
      <div className={styles.row}>
        <div className={styles.field}>
          <label htmlFor={`${idPrefix}-project-type`} className={styles.label}>Project type</label>
          <select id={`${idPrefix}-project-type`} name="projectType" className={styles.select} value={values.projectType} onChange={(event) => update("projectType", event.target.value)} aria-invalid={Boolean(errors.projectType)} aria-describedby={errors.projectType ? `${idPrefix}-projectType-error` : undefined}>
            <option value="" disabled>Select one</option>
            {projectTypes.map((type) => <option key={type} value={type}>{type}</option>)}
          </select>
          {errorFor("projectType")}
        </div>
        {variant === "full" && (
          <div className={styles.field}>
            <label htmlFor={`${idPrefix}-budget`} className={styles.label}>Budget range <span className={styles.optional}>(optional)</span></label>
            <select id={`${idPrefix}-budget`} name="budget" className={styles.select} value={values.budget} onChange={(event) => update("budget", event.target.value)}>
              <option value="">Prefer not to say</option>
              {budgetRanges.map((budget) => <option key={budget} value={budget}>{budget}</option>)}
            </select>
          </div>
        )}
      </div>
      {variant === "full" && messageField}
      <div className={styles.honeypot} aria-hidden="true">
        <label htmlFor={`${idPrefix}-website`}>Website</label>
        <input id={`${idPrefix}-website`} name="website" type="text" tabIndex={-1} autoComplete="off" value={values.website} onChange={(event) => update("website", event.target.value)} />
      </div>
      <div className={styles.consentField}>
        <label className={styles.consentLabel}>
          <input name="consent" type="checkbox" checked={values.consent} onChange={(event) => update("consent", event.target.checked)} aria-invalid={Boolean(errors.consent)} aria-describedby={errors.consent ? `${idPrefix}-consent-error` : undefined} />
          <span>I agree to be contacted about this inquiry. See our <a href="/privacy" className={styles.privacyLink}>privacy policy</a>.</span>
        </label>
        {errorFor("consent")}
      </div>
      {statusMessage && (
        <div className={`${styles.status} ${submitState === "error" ? styles.statusError : ""}`} role={submitState === "error" ? "alert" : "status"} aria-live="polite">
          <p>{statusMessage}</p>
          {submitState === "error" && <a href="mailto:hello@convenium.studio">Email hello@convenium.studio instead</a>}
        </div>
      )}
      <button type="submit" className={styles.submit} disabled={submitState === "pending"} aria-busy={submitState === "pending"}>
        {submitState === "pending" ? "Sending…" : "Send inquiry"}
      </button>
    </form>
  );
}
