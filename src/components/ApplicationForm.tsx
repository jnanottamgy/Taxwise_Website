"use client";

import { useRef, useState } from "react";
import { firm } from "@/lib/content";

/**
 * The application.
 *
 * The site is static — there is no server to receive a POST and nowhere to put
 * an uploaded file — so the form composes the application and hands it to the
 * applicant's own mail client, where attaching a CV is the natural thing to do
 * anyway. Nothing has to be configured for that to work.
 *
 * A mail client that is not registered opens nothing and reports nothing, so
 * the composed application is also shown on the page with a copy button and
 * the address beside it. Whichever way it went, the applicant can see that
 * their answers survived and can send them by hand.
 *
 * If the practice later wires a form endpoint — Formspree, Web3Forms, a
 * serverless function, anything that accepts multipart — setting
 * NEXT_PUBLIC_APPLICATION_ENDPOINT switches this to a direct post with a real
 * file upload, without a code change.
 *
 * Deliberately not asked: current salary, which is a poor basis for an offer
 * and restricted in several jurisdictions, and father's name, which is on the
 * form this one replaces and has no bearing on the application.
 */

const ENDPOINT = process.env.NEXT_PUBLIC_APPLICATION_ENDPOINT;

type Field = {
  name: string;
  label: string;
  type?: "text" | "email" | "tel" | "url" | "textarea";
  required?: boolean;
  hint?: string;
  half?: boolean;
};

const FIELDS: Field[] = [
  { name: "name", label: "Full name", required: true, half: true },
  { name: "email", label: "Email", type: "email", required: true, half: true },
  { name: "phone", label: "Telephone", type: "tel", required: true, half: true },
  { name: "qualification", label: "Qualification", half: true, hint: "CA, CA Inter, M.Com, or as applicable" },
  { name: "experience", label: "Years of experience", half: true, hint: "Leave blank if you are applying for articleship" },
  { name: "employer", label: "Current employer", half: true },
  { name: "notice", label: "Notice period", half: true },
  { name: "profile", label: "LinkedIn or portfolio", type: "url", half: true },
  {
    name: "about",
    label: "Anything you would like us to know",
    type: "textarea",
    hint: "A few sentences. What you have worked on, and what you want to work on next.",
  },
];

/**
 * A field is the one place on this site where the hairline language cannot be
 * followed. Everywhere else a 12% rule is decoration and exempt; here it is the
 * boundary of a control, which WCAG 1.4.11 puts at 3:1 — and 12% paper measured
 * 1.39:1 against this section's ground. An empty box you cannot find is not a
 * form. `paper-40` clears it with room for the lit part of the gradient.
 *
 * The site's focus ring is deliberately not suppressed here. It is the only
 * focus treatment on the page and a text field is exactly what it is for.
 */
const INPUT =
  "w-full rounded-sm border border-paper-40 bg-paper-06 px-4 py-3 text-[0.9375rem] text-paper transition-colors duration-300 placeholder:text-mist hover:border-paper-64 focus:border-gold";

export default function ApplicationForm({
  roles,
  defaultRole,
}: {
  roles: readonly { slug: string; title: string }[];
  /** Slug of the role this form was opened from, if any. */
  defaultRole?: string;
}) {
  const formRef = useRef<HTMLFormElement | null>(null);
  const [composed, setComposed] = useState<string | null>(null);
  const [subject, setSubject] = useState("");
  const [copied, setCopied] = useState(false);
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const roleSlug = String(data.get("role") ?? "");
    const role = roles.find((r) => r.slug === roleSlug)?.title ?? "General application";
    const line = `Application — ${role}`;

    if (ENDPOINT) {
      setBusy(true);
      try {
        const res = await fetch(ENDPOINT, { method: "POST", body: data, headers: { Accept: "application/json" } });
        setBusy(false);
        if (res.ok) {
          setSent(true);
          formRef.current?.reset();
          return;
        }
      } catch {
        setBusy(false);
      }
      // A failed post falls through to the email route rather than stranding
      // someone who has just typed out their history.
    }

    const body = [
      line,
      "",
      ...FIELDS.map((f) => {
        const v = String(data.get(f.name) ?? "").trim();
        return v ? `${f.label}: ${v}` : null;
      }).filter(Boolean),
      "",
      "— CV attached.",
    ].join("\n");

    setSubject(line);
    setComposed(body);
    setCopied(false);
    window.location.href = `mailto:${firm.email}?subject=${encodeURIComponent(line)}&body=${encodeURIComponent(body)}`;
  }

  async function copy() {
    if (!composed) return;
    await navigator.clipboard.writeText(composed);
    setCopied(true);
    setTimeout(() => setCopied(false), 2400);
  }

  if (sent) {
    return (
      <div className="border-t border-gold pt-8">
        <h3 className="font-display text-[clamp(1.5rem,2.6vw,2rem)] leading-[1.1] text-paper">
          Your application has been received.
        </h3>
        <p className="mt-5 max-w-[52ch] text-[1.0625rem] leading-[1.7] text-paper-80">
          A partner reads every application. You will hear from us either way, normally within a
          week.
        </p>
      </div>
    );
  }

  return (
    <>
      <form ref={formRef} onSubmit={onSubmit} noValidate={false}>
        <div className="grid gap-x-8 gap-y-7 sm:grid-cols-2">
          {/* The role sits first: it changes how everything below is read. */}
          <div className="sm:col-span-2">
            <label
              htmlFor="role"
              className="block font-mono text-[0.625rem] uppercase tracking-[0.16em] text-mist"
            >
              Applying for
            </label>
            <select
              id="role"
              name="role"
              defaultValue={defaultRole ?? ""}
              className={`${INPUT} appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="none" stroke="%238A9BBF" stroke-width="1.25"><path d="m3 6 5 5 5-5"/></svg>')] bg-[length:14px] bg-[right_1rem_center] bg-no-repeat pr-12 mt-3`}
            >
              <option value="">General application</option>
              {roles.map((r) => (
                <option key={r.slug} value={r.slug}>
                  {r.title}
                </option>
              ))}
            </select>
            <p className="mt-2.5 text-[0.75rem] leading-[1.6] text-paper-64">
              Nothing open that fits? Apply generally — we keep applications on file and read them
              when a post opens.
            </p>
          </div>

          {FIELDS.map((f) => (
            <div key={f.name} className={f.half ? "" : "sm:col-span-2"}>
              <label
                htmlFor={f.name}
                className="block font-mono text-[0.625rem] uppercase tracking-[0.16em] text-mist"
              >
                {f.label}
                {f.required ? <span className="text-gold"> *</span> : null}
              </label>
              {f.type === "textarea" ? (
                <textarea
                  id={f.name}
                  name={f.name}
                  rows={5}
                  required={f.required}
                  maxLength={1200}
                  aria-describedby={f.hint ? `${f.name}-hint` : undefined}
                  className={`${INPUT} mt-3 resize-y`}
                />
              ) : (
                <input
                  id={f.name}
                  name={f.name}
                  type={f.type ?? "text"}
                  required={f.required}
                  maxLength={160}
                  autoComplete={
                    f.name === "name" ? "name" : f.name === "email" ? "email" : f.name === "phone" ? "tel" : "off"
                  }
                  aria-describedby={f.hint ? `${f.name}-hint` : undefined}
                  className={`${INPUT} mt-3`}
                />
              )}
              {f.hint ? (
                <p id={`${f.name}-hint`} className="mt-2.5 text-[0.75rem] leading-[1.6] text-paper-64">
                  {f.hint}
                </p>
              ) : null}
            </div>
          ))}

          {ENDPOINT ? (
            <div className="sm:col-span-2">
              <label
                htmlFor="cv"
                className="block font-mono text-[0.625rem] uppercase tracking-[0.16em] text-mist"
              >
                Curriculum vitae
              </label>
              <input
                id="cv"
                name="cv"
                type="file"
                accept=".pdf,.doc,.docx"
                className="mt-3 block w-full text-[0.875rem] text-paper-64 file:mr-4 file:rounded-full file:border file:border-paper-12 file:bg-paper-06 file:px-5 file:py-2.5 file:font-mono file:text-[0.625rem] file:uppercase file:tracking-[0.14em] file:text-paper"
              />
            </div>
          ) : null}
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-5">
          <button
            type="submit"
            disabled={busy}
            className="btn-sheen inline-flex min-h-[3.25rem] items-center rounded-full bg-paper px-8 font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-ink transition duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 hover:shadow-[0_12px_40px_-12px_rgba(232,201,122,0.45)] disabled:opacity-60"
          >
            {busy ? "Sending" : "Send application"}
          </button>
          <p className="max-w-[34ch] text-[0.75rem] leading-[1.6] text-paper-64">
            {ENDPOINT
              ? "Attach your CV above. A partner reads every application."
              : "Opens an email to the office with your answers filled in. Attach your CV before you send it."}
          </p>
        </div>
      </form>

      {/* Shown after the mail client has been asked to open — which it may
          silently decline to do, on a machine with no mail handler set. */}
      {composed ? (
        <div className="mt-12 border-t border-gold pt-8">
          <h3 className="font-display text-[1.375rem] leading-[1.15] text-paper">
            Your application, ready to send
          </h3>
          <p className="mt-4 max-w-[56ch] text-[0.9375rem] leading-[1.7] text-paper-80">
            An email to{" "}
            <a
              href={`mailto:${firm.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(composed)}`}
              className="text-gold-lit underline decoration-gold/35 underline-offset-4"
            >
              {firm.email}
            </a>{" "}
            should have opened, with your CV still to attach. If it did not, copy the text below and
            send it yourself — the address is the same.
          </p>
          <pre className="mt-6 max-h-72 overflow-auto whitespace-pre-wrap rounded-sm border border-paper-12 bg-paper-06 p-5 font-mono text-[0.75rem] leading-[1.8] text-paper-80">
            {composed}
          </pre>
          <button
            type="button"
            onClick={copy}
            className="mt-5 inline-flex min-h-[2.75rem] items-center rounded-full border border-paper-12 px-6 font-mono text-[0.625rem] uppercase tracking-[0.16em] text-paper transition-colors duration-300 hover:border-gold hover:text-gold-lit"
          >
            {copied ? "Copied" : "Copy the application"}
          </button>
        </div>
      ) : null}
    </>
  );
}
