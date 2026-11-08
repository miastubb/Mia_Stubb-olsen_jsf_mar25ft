"use client";

import { useState, type SubmitEvent } from "react";
import {
  validateContactForm,
  type ContactFormValues,
} from "@/utils/validateContactForm";

type FieldName = keyof ContactFormValues;

const initialValues: ContactFormValues = {
  fullName: "",
  subject: "",
  email: "",
  message: "",
};

const fieldOrder: FieldName[] = ["fullName", "subject", "email", "message"];

const inputClasses =
  "mt-2 w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 text-zinc-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-800";

export default function ContactPage() {
  const [values, setValues] = useState<ContactFormValues>(initialValues);
  const [touched, setTouched] = useState<Partial<Record<FieldName, boolean>>>(
    {},
  );
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const errors = validateContactForm(values);

  function updateField(field: FieldName, value: string) {
    setValues((current) => ({
      ...current,
      [field]: value,
    }));
    setIsSuccess(false);
  }

  function markTouched(field: FieldName) {
    setTouched((current) => ({
      ...current,
      [field]: true,
    }));
  }

  function getFieldError(field: FieldName) {
    return hasAttemptedSubmit || touched[field] ? errors[field] : undefined;
  }

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setHasAttemptedSubmit(true);
    setIsSuccess(false);

    const firstInvalidField = fieldOrder.find((field) => errors[field]);

    if (firstInvalidField) {
      const input = event.currentTarget.elements.namedItem(firstInvalidField);

      if (input instanceof HTMLElement) {
        input.focus();
      }

      return;
    }

    setIsSuccess(true);
  }

  const fullNameError = getFieldError("fullName");
  const subjectError = getFieldError("subject");
  const emailError = getFieldError("email");
  const messageError = getFieldError("message");

  return (
    <section
      aria-labelledby="contact-heading"
      className="mx-auto w-full max-w-2xl"
    >
      <h1
        id="contact-heading"
        className="mb-3 text-3xl font-bold text-zinc-950"
      >
        Contact us
      </h1>

      <p className="mb-6 text-zinc-700">
        Have a question? Fill in the form below. All fields are required.
      </p>

      <div className="rounded-xl bg-white px-6 py-8 shadow-sm sm:px-8 lg:px-12">
        <div role="status" aria-live="polite" aria-atomic="true">
          {isSuccess && (
            <p className="mb-6 rounded-lg border border-teal-700 bg-teal-50 p-4 text-teal-900">
              Your form passed validation successfully.
            </p>
          )}
        </div>

        {hasAttemptedSubmit && Object.keys(errors).length > 0 && (
          <p
            role="alert"
            className="mb-6 rounded-lg border border-red-300 bg-red-50 p-4 text-red-800"
          >
            Please correct the highlighted fields below.
          </p>
        )}

        <form noValidate onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="fullName"
              className="block text-sm font-medium text-zinc-800"
            >
              Full name *
            </label>

            <input
              id="fullName"
              name="fullName"
              type="text"
              autoComplete="name"
              required
              minLength={3}
              value={values.fullName}
              onChange={(event) => updateField("fullName", event.target.value)}
              onBlur={() => markTouched("fullName")}
              aria-invalid={Boolean(fullNameError)}
              aria-describedby={fullNameError ? "fullName-error" : undefined}
              className={inputClasses}
            />

            {fullNameError && (
              <p id="fullName-error" className="mt-2 text-sm text-red-700">
                {fullNameError}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="subject"
              className="block text-sm font-medium text-zinc-800"
            >
              Subject *
            </label>

            <input
              id="subject"
              name="subject"
              type="text"
              required
              minLength={3}
              value={values.subject}
              onChange={(event) => updateField("subject", event.target.value)}
              onBlur={() => markTouched("subject")}
              aria-invalid={Boolean(subjectError)}
              aria-describedby={subjectError ? "subject-error" : undefined}
              className={inputClasses}
            />

            {subjectError && (
              <p id="subject-error" className="mt-2 text-sm text-red-700">
                {subjectError}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-zinc-800"
            >
              Email address *
            </label>

            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={values.email}
              onChange={(event) => updateField("email", event.target.value)}
              onBlur={() => markTouched("email")}
              aria-invalid={Boolean(emailError)}
              aria-describedby={emailError ? "email-error" : undefined}
              className={inputClasses}
            />

            {emailError && (
              <p id="email-error" className="mt-2 text-sm text-red-700">
                {emailError}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="message"
              className="block text-sm font-medium text-zinc-800"
            >
              Message *
            </label>

            <textarea
              id="message"
              name="message"
              rows={3}
              required
              minLength={10}
              value={values.message}
              onChange={(event) => updateField("message", event.target.value)}
              onBlur={() => markTouched("message")}
              aria-invalid={Boolean(messageError)}
              aria-describedby={messageError ? "message-error" : undefined}
              className={`${inputClasses} resize-y`}
            />

            {messageError && (
              <p id="message-error" className="mt-2 text-sm text-red-700">
                {messageError}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full cursor-pointer rounded-lg border border-black/40 bg-teal-800 px-6 py-3 font-semibold text-white transition-colors hover:bg-teal-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
          >
            Send message
          </button>
        </form>
      </div>
    </section>
  );
}
