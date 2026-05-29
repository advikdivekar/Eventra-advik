/**
 * FormErrorSummary
 *
 * Renders a focused, accessible summary of all form validation errors.
 *
 * Accessibility rationale
 * ───────────────────────
 * Individual field errors are announced by screen readers when focus enters
 * the field (via `aria-invalid` + `aria-describedby`). However, when a user
 * submits a form with multiple errors, they only hear the error for the first
 * field that receives focus. A summary panel:
 *
 *  1. Uses `role="alert"` so the entire list is announced immediately on
 *     appearance without requiring a focus change.
 *  2. Provides clickable links to jump focus directly to the invalid field,
 *     which is especially helpful for users relying on screen readers or
 *     keyboard navigation.
 *  3. Is visually placed above the submit button so sighted users notice it
 *     naturally.
 *
 * Usage:
 *   <FormErrorSummary errors={errors} fieldOrder={["title", "date", "location"]} />
 *
 * Where `errors` is an object like { title: "Title is required", date: "" }
 * and `fieldOrder` is the order in which fields appear on screen (so the
 * summary links appear in DOM order).
 */

import React, { useEffect, useRef } from "react";
import { AlertCircle } from "lucide-react";

const FormErrorSummary = ({ errors = {}, fieldOrder = [], headingId }) => {
  const summaryRef = useRef(null);

  // Filter to only fields that have an error message
  const errorEntries = (fieldOrder.length > 0 ? fieldOrder : Object.keys(errors))
    .map((key) => ({ key, message: errors[key] }))
    .filter(({ message }) => !!message);

  // Shift focus to the summary when it first appears so screen readers
  // announce the error list without the user having to navigate to it.
  useEffect(() => {
    if (errorEntries.length > 0 && summaryRef.current) {
      summaryRef.current.focus();
    }
  }, [errorEntries.length]);

  if (errorEntries.length === 0) return null;

  const defaultHeadingId = "form-error-summary-heading";
  const resolvedHeadingId = headingId || defaultHeadingId;

  return (
    <div
      ref={summaryRef}
      role="alert"
      aria-live="assertive"
      aria-labelledby={resolvedHeadingId}
      tabIndex={-1}
      className="rounded-xl border border-red-300 bg-red-50 dark:border-red-700 dark:bg-red-900/20 p-4 focus:outline-none focus:ring-2 focus:ring-red-500"
    >
      <div className="flex items-start gap-3">
        <AlertCircle
          className="mt-0.5 h-5 w-5 shrink-0 text-red-500 dark:text-red-400"
          aria-hidden="true"
        />
        <div className="min-w-0 flex-1">
          <h2
            id={resolvedHeadingId}
            className="text-sm font-semibold text-red-800 dark:text-red-200"
          >
            {errorEntries.length === 1
              ? "There is 1 error in this form"
              : `There are ${errorEntries.length} errors in this form`}
          </h2>
          <ul
            className="mt-2 list-disc pl-5 space-y-1"
            aria-label="List of form errors"
          >
            {errorEntries.map(({ key, message }) => (
              <li key={key} className="text-sm text-red-700 dark:text-red-300">
                <a
                  href={`#${key}`}
                  className="underline hover:no-underline focus:outline-none focus:ring-1 focus:ring-red-500 rounded"
                  onClick={(e) => {
                    // Move focus to the field rather than scrolling with the anchor
                    e.preventDefault();
                    const el = document.getElementById(key);
                    if (el) {
                      el.focus();
                      el.scrollIntoView({ behavior: "smooth", block: "center" });
                    }
                  }}
                >
                  {message}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default FormErrorSummary;
