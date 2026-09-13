"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Status = "idle" | "submitting" | "success" | "error";

// How long the acknowledgement stays on screen before the visitor is
// returned to the homepage. Long enough to read it twice.
const REDIRECT_SECONDS = 6;

const DEFAULT_CONSENT =
  "I understand my message will be reviewed by The Haney Group and consent to being contacted about my inquiry.";

export function ContactForm({
  consentLanguage,
  submitLabel,
}: {
  consentLanguage?: string;
  submitLabel?: string;
}) {
  const router = useRouter();
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [secondsLeft, setSecondsLeft] = useState(REDIRECT_SECONDS);

  // After a successful send, count down and hand the visitor back to the
  // homepage. Cancelled if they navigate away first.
  useEffect(() => {
    if (status !== "success") return;
    const tick = window.setInterval(() => {
      setSecondsLeft((n) => (n > 0 ? n - 1 : 0));
    }, 1000);
    const go = window.setTimeout(() => {
      router.push("/");
    }, REDIRECT_SECONDS * 1000);
    return () => {
      window.clearInterval(tick);
      window.clearTimeout(go);
    };
  }, [status, router]);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    const form = e.currentTarget;
    const fd = new FormData(form);
    const payload = {
      name: String(fd.get("name") ?? ""),
      organization: String(fd.get("organization") ?? ""),
      email: String(fd.get("email") ?? ""),
      phone: String(fd.get("phone") ?? ""),
      inquiry_type: String(fd.get("inquiry_type") ?? ""),
      message: String(fd.get("message") ?? ""),
      consent: fd.get("consent") === "on",
      // Honeypot: real users never fill this. The field name is opaque
      // on purpose so password managers / Chrome autofill don't match it.
      hp_check: String(fd.get("hp_check") ?? ""),
      source_page: typeof window !== "undefined" ? window.location.pathname : "/contact",
    };

    if (!payload.name || !payload.email || !payload.message || !payload.consent) {
      setStatus("error");
      setErrorMessage("Please fill in the required fields and confirm consent.");
      return;
    }

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Something went wrong sending your note.");
      }
      setStatus("success");
      form.reset();
    } catch (err) {
      setStatus("error");
      setErrorMessage(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again or call (512) 925-5000."
      );
    }
  }

  if (status === "success") {
    return (
      <div className="form__status form__status--success" role="status">
        <strong>Thank you.</strong> Your note has reached The Haney Group. A
        principal will be in touch within one business day.
        <p className="form__status-redirect">
          Returning you to the homepage in {secondsLeft}{" "}
          {secondsLeft === 1 ? "second" : "seconds"} —{" "}
          <Link href="/">go now</Link>.
        </p>
      </div>
    );
  }

  return (
    <form className="form" onSubmit={onSubmit} noValidate>
      {/* Honeypot — must stay empty. Opaque name + autocomplete="off"
          + tabIndex=-1 + aria-hidden so browser autofill and password
          managers don't trip it. Bots that fill every input by name
          still will. */}
      <div className="form__honeypot" aria-hidden="true">
        <label htmlFor="f-hp">Leave this field blank</label>
        <input
          id="f-hp"
          name="hp_check"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="form__row">
        <label htmlFor="f-name">Name</label>
        <input id="f-name" name="name" type="text" autoComplete="name" required />
      </div>
      <div className="form__row">
        <label htmlFor="f-org">Organization</label>
        <input
          id="f-org"
          name="organization"
          type="text"
          autoComplete="organization"
        />
      </div>
      <div className="form__row">
        <label htmlFor="f-email">Email</label>
        <input id="f-email" name="email" type="email" autoComplete="email" required />
      </div>
      <div className="form__row">
        <label htmlFor="f-phone">Phone</label>
        <input id="f-phone" name="phone" type="tel" autoComplete="tel" />
      </div>
      <div className="form__row form__row--full">
        <label htmlFor="f-topic">Nature of inquiry</label>
        <select id="f-topic" name="inquiry_type" defaultValue="">
          <option value="" disabled>
            Select one…
          </option>
          <option>Legislative strategy / specific bill</option>
          <option>Appropriations / budget rider</option>
          <option>Public affairs / communications</option>
          <option>Parliamentary procedure consult</option>
          <option>Coalition / association engagement</option>
          <option>General inquiry</option>
        </select>
      </div>
      <div className="form__row form__row--full">
        <label htmlFor="f-msg">How can we help?</label>
        <textarea id="f-msg" name="message" required></textarea>
      </div>
      <label className="form__consent">
        <input type="checkbox" name="consent" required />
        <span>{consentLanguage ?? DEFAULT_CONSENT}</span>
      </label>
      {status === "error" ? (
        <div className="form__status form__status--error" role="alert">
          {errorMessage}
        </div>
      ) : null}
      <div className="form__submit form__row--full">
        <button
          className="btn btn--primary"
          type="submit"
          disabled={status === "submitting"}
        >
          {status === "submitting" ? "Sending…" : submitLabel ?? "Send Message"}{" "}
          <span className="arrow" aria-hidden="true">
            →
          </span>
        </button>
      </div>
    </form>
  );
}
