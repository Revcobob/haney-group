"use client";

import { useActionState } from "react";
import { SaveBar } from "./SaveBar";
import {
  SectionTextField,
  SectionTextareaField,
  SectionCtaField,
  SectionImageField,
  SectionParagraphList,
  SectionCardList,
} from "./SectionFields";
import type { ActionResult } from "@/lib/admin/actions/_helpers";
import type { FieldConfig, SectionTypeDef } from "@/lib/sections/types";

type Action = (
  prev: ActionResult | undefined,
  formData: FormData
) => Promise<ActionResult>;

type Cta = { label?: string; href?: string };
type CardArrItem = { image_id: string; image_url: string; title: string; body: string };

function asString(v: unknown): string {
  return typeof v === "string" ? v : "";
}
function asCta(v: unknown): Cta {
  if (v && typeof v === "object") {
    const o = v as Record<string, unknown>;
    return { label: asString(o.label), href: asString(o.href) };
  }
  return { label: "", href: "" };
}
function asCardArray(v: unknown): CardArrItem[] {
  if (!Array.isArray(v)) return [];
  return v.map((c) => {
    if (c && typeof c === "object") {
      const o = c as Record<string, unknown>;
      return {
        image_id: asString(o.image_id),
        image_url: asString(o.image_url),
        title: asString(o.title),
        body: asString(o.body),
      };
    }
    return { image_id: "", image_url: "", title: "", body: "" };
  });
}

function renderField(field: FieldConfig, content: Record<string, unknown>) {
  const v = content[field.key];
  switch (field.type) {
    case "text":
      return (
        <SectionTextField
          key={field.key}
          name={field.key}
          label={field.label}
          defaultValue={asString(v)}
          help={field.help}
          placeholder={field.placeholder}
          maxLength={field.maxLength}
        />
      );
    case "textarea":
    case "richtext-inline":
      return (
        <SectionTextareaField
          key={field.key}
          name={field.key}
          label={field.label}
          defaultValue={asString(v)}
          help={field.help}
          placeholder={field.placeholder}
          maxLength={field.maxLength}
          rows={field.type === "richtext-inline" ? 4 : 3}
        />
      );
    case "image": {
      // image fields use foo_id (stored) + foo_url (resolved by accessor)
      const base = field.key.endsWith("_id") ? field.key.slice(0, -3) : field.key;
      const idVal = asString(content[`${base}_id`] ?? content[field.key]);
      const urlVal = asString(content[`${base}_url`]);
      return (
        <SectionImageField
          key={field.key}
          name={field.key.endsWith("_id") ? field.key : `${field.key}_id`}
          label={field.label}
          defaultId={idVal}
          defaultUrl={urlVal}
          help={field.help}
        />
      );
    }
    case "cta": {
      const cta = asCta(v);
      return (
        <SectionCtaField
          key={field.key}
          name={field.key}
          label={field.label}
          defaultLabel={cta.label}
          defaultHref={cta.href}
        />
      );
    }
    case "paragraph-list": {
      const arr = Array.isArray(v) ? v.map(asString) : [];
      return (
        <SectionParagraphList
          key={field.key}
          name={field.key}
          label={field.label}
          defaultValue={arr}
          help={field.help}
        />
      );
    }
    case "card-list-proof":
      return (
        <SectionCardList
          key={field.key}
          name={field.key}
          label={field.label}
          defaultValue={asCardArray(v)}
          cardLabel="Proof item"
          help={field.help}
        />
      );
    case "card-list-approach":
      return (
        <SectionCardList
          key={field.key}
          name={field.key}
          label={field.label}
          defaultValue={asCardArray(v)}
          cardLabel="Step"
          help={field.help}
        />
      );
    default:
      return null;
  }
}

export function SectionForm({
  typeDef,
  content,
  action,
  cancelHref,
}: {
  typeDef: SectionTypeDef;
  content: Record<string, unknown>;
  action: Action;
  cancelHref?: string;
}) {
  const [state, formAction] = useActionState<ActionResult | undefined, FormData>(
    action,
    undefined
  );
  const status = !state ? "idle" : state.ok ? "success" : "error";
  const message = !state ? undefined : state.ok ? "Saved." : state.error;

  return (
    <form action={formAction} className="adminform">
      <section className="adminform__section">
        <div className="adminform__section-head">
          <p className="adminform__section-eyebrow">Section · {typeDef.type}</p>
          <h2>{typeDef.label}</h2>
          <p>{typeDef.description}</p>
        </div>
        {typeDef.fields.map((f) => renderField(f, content))}
      </section>
      <SaveBar status={status} message={message} cancelHref={cancelHref} />
    </form>
  );
}
