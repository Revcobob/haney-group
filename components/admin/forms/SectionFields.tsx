"use client";

import { useState } from "react";
import { FieldShell } from "./Fields";
import { MediaPickerField } from "./MediaPickerField";

// ---------- text + textarea ----------
export function SectionTextField({
  name,
  label,
  defaultValue,
  help,
  placeholder,
  maxLength,
}: {
  name: string;
  label: string;
  defaultValue?: string;
  help?: string;
  placeholder?: string;
  maxLength?: number;
}) {
  const id = `f-${name.replace(/[^a-z0-9]/gi, "-")}`;
  return (
    <FieldShell id={id} label={label} help={help}>
      <input
        id={id}
        name={name}
        type="text"
        className="adminfield__input"
        defaultValue={defaultValue ?? ""}
        placeholder={placeholder}
        maxLength={maxLength}
        autoComplete="off"
      />
    </FieldShell>
  );
}

export function SectionTextareaField({
  name,
  label,
  defaultValue,
  help,
  placeholder,
  maxLength,
  rows = 3,
}: {
  name: string;
  label: string;
  defaultValue?: string;
  help?: string;
  placeholder?: string;
  maxLength?: number;
  rows?: number;
}) {
  const id = `f-${name.replace(/[^a-z0-9]/gi, "-")}`;
  return (
    <FieldShell id={id} label={label} help={help}>
      <textarea
        id={id}
        name={name}
        className="adminfield__textarea"
        rows={rows}
        defaultValue={defaultValue ?? ""}
        placeholder={placeholder}
        maxLength={maxLength}
      />
    </FieldShell>
  );
}

// ---------- CTA (label + href) ----------
export function SectionCtaField({
  name,
  label,
  defaultLabel,
  defaultHref,
}: {
  name: string;
  label: string;
  defaultLabel?: string;
  defaultHref?: string;
}) {
  return (
    <div className="adminform__section" style={{ background: "var(--paper-2)" }}>
      <div className="adminform__section-head" style={{ marginBottom: 0 }}>
        <p className="adminform__section-eyebrow">Button</p>
        <h2 style={{ fontSize: 15 }}>{label}</h2>
        <p>Leave both blank to hide the button.</p>
      </div>
      <div className="adminform__row two">
        <SectionTextField
          name={`${name}.label`}
          label="Button text"
          defaultValue={defaultLabel}
          maxLength={60}
        />
        <SectionTextField
          name={`${name}.href`}
          label="Button link"
          defaultValue={defaultHref}
          placeholder="/contact or https://…"
          maxLength={300}
        />
      </div>
    </div>
  );
}

// ---------- image picker ----------
// Thin wrapper so the section editor speaks the same API as before, but
// the actual UI (preview + library lookup) lives in MediaPickerField.
export function SectionImageField({
  name,
  label,
  defaultId,
  defaultUrl,
  help,
}: {
  name: string;
  label: string;
  defaultId?: string;
  defaultUrl?: string;
  help?: string;
}) {
  return (
    <MediaPickerField
      name={name}
      label={label}
      defaultId={defaultId}
      defaultUrl={defaultUrl}
      help={help}
    />
  );
}

// ---------- paragraph list (string[]) ----------
export function SectionParagraphList({
  name,
  label,
  defaultValue,
  help,
}: {
  name: string;
  label: string;
  defaultValue?: string[];
  help?: string;
}) {
  const [items, setItems] = useState<string[]>(
    defaultValue && defaultValue.length > 0 ? defaultValue : [""]
  );
  return (
    <div className="adminfield">
      <span className="adminfield__label">{label}</span>
      {help ? <p className="adminfield__help">{help}</p> : null}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {items.map((v, i) => (
          <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
            <textarea
              name={`${name}[${i}]`}
              className="adminfield__textarea"
              rows={3}
              value={v}
              onChange={(e) => {
                const next = items.slice();
                next[i] = e.target.value;
                setItems(next);
              }}
            />
            <button
              type="button"
              className="adminbtn adminbtn--ghost adminbtn--small"
              onClick={() => setItems(items.filter((_, idx) => idx !== i))}
              disabled={items.length === 1}
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          className="adminbtn adminbtn--ghost adminbtn--small"
          style={{ alignSelf: "flex-start" }}
          onClick={() => setItems([...items, ""])}
        >
          + Add paragraph
        </button>
      </div>
    </div>
  );
}

// ---------- card list (proof items / approach steps) ----------
type CardItem = { image_id?: string; image_url?: string; title: string; body: string };

export function SectionCardList({
  name,
  label,
  defaultValue,
  cardLabel,
  help,
}: {
  name: string;
  label: string;
  defaultValue?: CardItem[];
  cardLabel: string;
  help?: string;
}) {
  const [items, setItems] = useState<CardItem[]>(
    defaultValue && defaultValue.length > 0
      ? defaultValue.map((d) => ({
          image_id: d.image_id ?? "",
          image_url: d.image_url ?? "",
          title: d.title ?? "",
          body: d.body ?? "",
        }))
      : []
  );

  function update(i: number, patch: Partial<CardItem>) {
    const next = items.slice();
    next[i] = { ...next[i], ...patch };
    setItems(next);
  }

  return (
    <div className="adminfield">
      <span className="adminfield__label">{label}</span>
      {help ? <p className="adminfield__help">{help}</p> : null}
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {items.map((it, i) => (
          <div
            key={i}
            className="adminform__section"
            style={{ background: "var(--paper-2)" }}
          >
            <div className="adminform__section-head" style={{ marginBottom: 0 }}>
              <p className="adminform__section-eyebrow">
                {cardLabel} {i + 1}
              </p>
            </div>
            <SectionImageField
              name={`${name}[${i}].image_id`}
              label="Image"
              defaultId={it.image_id}
              defaultUrl={it.image_url}
            />
            <SectionTextField
              name={`${name}[${i}].title`}
              label="Title"
              defaultValue={it.title}
              maxLength={120}
            />
            <SectionTextareaField
              name={`${name}[${i}].body`}
              label="Body"
              defaultValue={it.body}
              rows={3}
              maxLength={400}
            />
            <div>
              <button
                type="button"
                className="adminbtn adminbtn--danger adminbtn--small"
                onClick={() => setItems(items.filter((_, idx) => idx !== i))}
              >
                Remove {cardLabel.toLowerCase()}
              </button>
            </div>
          </div>
        ))}
        <button
          type="button"
          className="adminbtn adminbtn--ghost adminbtn--small"
          style={{ alignSelf: "flex-start" }}
          onClick={() =>
            setItems([
              ...items,
              { image_id: "", image_url: "", title: "", body: "" },
            ])
          }
        >
          + Add {cardLabel.toLowerCase()}
        </button>
      </div>
    </div>
  );
}
