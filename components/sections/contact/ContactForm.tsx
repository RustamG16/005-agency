"use client";

import { useId, useState, type FormEvent } from "react";
import { projectTypes, budgetRanges } from "@/content/contact";
import styles from "./ContactForm.module.css";

type FormState = {
  name: string;
  email: string;
  company: string;
  projectType: string;
  budget: string;
  message: string;
  consent: boolean;
};

const initialState: FormState = {
  name: "",
  email: "",
  company: "",
  projectType: "",
  budget: "",
  message: "",
  consent: false,
};

type Errors = Partial<Record<keyof FormState, string>>;

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function ContactForm() {
  const [values, setValues] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);
  const [pending, setPending] = useState(false);
  const idPrefix = useId();

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  function validate(): Errors {
    const next: Errors = {};
    if (!values.name.trim()) next.name = "Enter your name.";
    if (!values.email.trim()) next.email = "Enter your email.";
    else if (!isValidEmail(values.email)) next.email = "Enter a valid email address.";
    if (!values.projectType) next.projectType = "Select a project type.";
    if (!values.message.trim()) next.message = "Tell us a little about the project.";
    if (!values.consent) next.consent = "Consent is required to send this inquiry.";
    return next;
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const next = validate();
    setErrors(next);
    if (Object.keys(next).length === 0) {
      // Client-only for now — no backend this session. Pending state is honest UX.
      setPending(true);
      window.setTimeout(() => {
        setPending(false);
        setSubmitted(true);
      }, 600);
    }
  }

  if (submitted) {
    return (
      <div className={styles.success} role="status">
        <p className={styles.successHeading}>Inquiry received.</p>
        <p className={styles.successBody}>
          Thank you, {values.name.split(" ")[0]}. We read every inquiry personally and reply
          within two business days.
        </p>
      </div>
    );
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <div className={styles.field}>
        <label htmlFor={`${idPrefix}-name`} className={styles.label}>
          Name
        </label>
        <input
          id={`${idPrefix}-name`}
          className={styles.input}
          type="text"
          autoComplete="name"
          value={values.name}
          onChange={(e) => update("name", e.target.value)}
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? `${idPrefix}-name-error` : undefined}
        />
        {errors.name && (
          <p id={`${idPrefix}-name-error`} className={styles.error}>
            {errors.name}
          </p>
        )}
      </div>

      <div className={styles.field}>
        <label htmlFor={`${idPrefix}-email`} className={styles.label}>
          Email
        </label>
        <input
          id={`${idPrefix}-email`}
          className={styles.input}
          type="email"
          autoComplete="email"
          value={values.email}
          onChange={(e) => update("email", e.target.value)}
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? `${idPrefix}-email-error` : undefined}
        />
        {errors.email && (
          <p id={`${idPrefix}-email-error`} className={styles.error}>
            {errors.email}
          </p>
        )}
      </div>

      <div className={styles.field}>
        <label htmlFor={`${idPrefix}-company`} className={styles.label}>
          Company <span className={styles.optional}>(optional)</span>
        </label>
        <input
          id={`${idPrefix}-company`}
          className={styles.input}
          type="text"
          autoComplete="organization"
          value={values.company}
          onChange={(e) => update("company", e.target.value)}
        />
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label htmlFor={`${idPrefix}-project-type`} className={styles.label}>
            Project type
          </label>
          <select
            id={`${idPrefix}-project-type`}
            className={styles.select}
            value={values.projectType}
            onChange={(e) => update("projectType", e.target.value)}
            aria-invalid={Boolean(errors.projectType)}
            aria-describedby={errors.projectType ? `${idPrefix}-project-type-error` : undefined}
          >
            <option value="" disabled>
              Select one
            </option>
            {projectTypes.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          {errors.projectType && (
            <p id={`${idPrefix}-project-type-error`} className={styles.error}>
              {errors.projectType}
            </p>
          )}
        </div>

        <div className={styles.field}>
          <label htmlFor={`${idPrefix}-budget`} className={styles.label}>
            Budget range <span className={styles.optional}>(optional)</span>
          </label>
          <select
            id={`${idPrefix}-budget`}
            className={styles.select}
            value={values.budget}
            onChange={(e) => update("budget", e.target.value)}
          >
            <option value="">Prefer not to say</option>
            {budgetRanges.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className={styles.field}>
        <label htmlFor={`${idPrefix}-message`} className={styles.label}>
          Message
        </label>
        <textarea
          id={`${idPrefix}-message`}
          className={styles.textarea}
          rows={5}
          value={values.message}
          onChange={(e) => update("message", e.target.value)}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? `${idPrefix}-message-error` : undefined}
        />
        {errors.message && (
          <p id={`${idPrefix}-message-error`} className={styles.error}>
            {errors.message}
          </p>
        )}
      </div>

      <div className={styles.consentField}>
        <label className={styles.consentLabel}>
          <input
            type="checkbox"
            checked={values.consent}
            onChange={(e) => update("consent", e.target.checked)}
            aria-invalid={Boolean(errors.consent)}
            aria-describedby={errors.consent ? `${idPrefix}-consent-error` : undefined}
          />
          <span>
            I agree to be contacted about this inquiry. See our{" "}
            <a href="/privacy" className={styles.privacyLink}>
              privacy policy
            </a>
            .
          </span>
        </label>
        {errors.consent && (
          <p id={`${idPrefix}-consent-error`} className={styles.error}>
            {errors.consent}
          </p>
        )}
      </div>

      <button type="submit" className={styles.submit} disabled={pending} aria-busy={pending}>
        {pending ? "Sending…" : "Send Inquiry"}
      </button>
    </form>
  );
}
