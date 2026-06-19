"use client";

import { useState, type FormEvent } from "react";

type Status = "idle" | "submitting" | "success" | "error";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");

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
      company_website: String(fd.get("company_website") ?? ""), // honeypot
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
      </div>
    );
  }

  return (
    <form className="form" onSubmit={onSubmit} noValidate>
      {/* honeypot — must stay empty */}
      <div className="form__honeypot" aria-hidden="true">
        <label htmlFor="f-company">Company website</label>
        <input
          id="f-company"
          name="company_website"
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
        <span>
          I understand my message will be reviewed by The Haney Group and
          consent to being contacted about my inquiry.
        </span>
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
          {status === "submitting" ? "Sending…" : "Send Message"}{" "}
          <span className="arrow" aria-hidden="true">
            →
          </span>
        </button>
      </div>
    </form>
  );
}
