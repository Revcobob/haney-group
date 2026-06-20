"use client";

import { useActionState, useEffect, useRef } from "react";
import { SaveBar } from "./SaveBar";
import {
  SectionTextField,
  SectionTextareaField,
  SectionCtaField,
  SectionImageField,
  SectionParagraphList,
  SectionCardList,
  SectionStatList,
  SectionPrinciplesList,
  SectionFounderList,
  SectionAudienceList,
} from "./SectionFields";
import { TiptapEditor } from "../TiptapEditor";
import { FieldShell } from "./Fields";
import type { ActionResult } from "@/lib/admin/actions/_helpers";
import type { FieldConfig } from "@/lib/sections/types";

// Serializable subset of SectionTypeDef. The schema + empty() function
// stay on the server; the client only needs to render fields and labels.
export type SectionTypeClient = {
  type: string;
  label: string;
  description: string;
  fields: FieldConfig[];
};

type Action = (
  prev: ActionResult | undefined,
  formData: FormData
) => Promise<ActionResult>;

type Cta = { label?: string; href?: string };
type CardArrItem = { image_id: string; image_url: string; title: string; body: string };
type StatItem = { num: string; label: string };
type PrincipleItem = { num: string; title: string; body: string };
type FounderItem = { name: string; role: string; bio: string };
type AudienceItem = { title: string; body: string };

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
function asStatArray(v: unknown): StatItem[] {
  if (!Array.isArray(v)) return [];
  return v.map((c) => {
    if (c && typeof c === "object") {
      const o = c as Record<string, unknown>;
      return { num: asString(o.num), label: asString(o.label) };
    }
    return { num: "", label: "" };
  });
}
function asPrinciplesArray(v: unknown): PrincipleItem[] {
  if (!Array.isArray(v)) return [];
  return v.map((c) => {
    if (c && typeof c === "object") {
      const o = c as Record<string, unknown>;
      return {
        num: asString(o.num),
        title: asString(o.title),
        body: asString(o.body),
      };
    }
    return { num: "", title: "", body: "" };
  });
}
function asFounderArray(v: unknown): FounderItem[] {
  if (!Array.isArray(v)) return [];
  return v.map((c) => {
    if (c && typeof c === "object") {
      const o = c as Record<string, unknown>;
      return {
        name: asString(o.name),
        role: asString(o.role),
        bio: asString(o.bio),
      };
    }
    return { name: "", role: "", bio: "" };
  });
}
function asAudienceArray(v: unknown): AudienceItem[] {
  if (!Array.isArray(v)) return [];
  return v.map((c) => {
    if (c && typeof c === "object") {
      const o = c as Record<string, unknown>;
      return { title: asString(o.title), body: asString(o.body) };
    }
    return { title: "", body: "" };
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
    case "stat-list":
      return (
        <SectionStatList
          key={field.key}
          name={field.key}
          label={field.label}
          defaultValue={asStatArray(v)}
          help={field.help}
        />
      );
    case "principles-list":
      return (
        <SectionPrinciplesList
          key={field.key}
          name={field.key}
          label={field.label}
          defaultValue={asPrinciplesArray(v)}
          help={field.help}
        />
      );
    case "founder-list":
      return (
        <SectionFounderList
          key={field.key}
          name={field.key}
          label={field.label}
          defaultValue={asFounderArray(v)}
          help={field.help}
        />
      );
    case "audience-list":
      return (
        <SectionAudienceList
          key={field.key}
          name={field.key}
          label={field.label}
          defaultValue={asAudienceArray(v)}
          help={field.help}
        />
      );
    case "rich-text": {
      const id = `f-${field.key.replace(/[^a-z0-9]/gi, "-")}`;
      return (
        <FieldShell key={field.key} id={id} label={field.label} help={field.help}>
          <TiptapEditor
            name={field.key}
            defaultHtml={asString(v)}
            placeholder={field.placeholder}
          />
        </FieldShell>
      );
    }
    default:
      return null;
  }
}

export type SectionMeta = {
  pageId: string;
  pageSlug: string;
  sectionKey: string;
  sectionLabel: string;
  sectionType: string;
  displayOrder: number;
};

export function SectionForm({
  typeDef,
  content,
  action,
  meta,
  cancelHref,
  onSaved,
  compact,
}: {
  typeDef: SectionTypeClient;
  content: Record<string, unknown>;
  action: Action;
  meta: SectionMeta;
  cancelHref?: string;
  onSaved?: () => void;
  compact?: boolean;
}) {
  const [state, formAction] = useActionState<ActionResult | undefined, FormData>(
    action,
    undefined
  );
  const status = !state ? "idle" : state.ok ? "success" : "error";
  const message = !state ? undefined : state.ok ? "Saved." : state.error;

  // Fire onSaved exactly once per state object — useActionState returns the
  // same reference until the next submit, so an identity check on `state`
  // prevents the iframe-reload from looping when the parent re-renders.
  const lastNotifiedState = useRef<typeof state | undefined>(undefined);
  useEffect(() => {
    if (state?.ok && onSaved && lastNotifiedState.current !== state) {
      lastNotifiedState.current = state;
      onSaved();
    }
  }, [state, onSaved]);

  return (
    <form action={formAction} className="adminform">
      {/* Hidden context for the server action — no per-call bind required */}
      <input type="hidden" name="_meta_page_id" value={meta.pageId} />
      <input type="hidden" name="_meta_page_slug" value={meta.pageSlug} />
      <input type="hidden" name="_meta_section_key" value={meta.sectionKey} />
      <input type="hidden" name="_meta_section_label" value={meta.sectionLabel} />
      <input type="hidden" name="_meta_section_type" value={meta.sectionType} />
      <input
        type="hidden"
        name="_meta_display_order"
        value={String(meta.displayOrder)}
      />

      <section className="adminform__section">
        <div className="adminform__section-head">
          <p className="adminform__section-eyebrow">Section · {typeDef.type}</p>
          <h2>{typeDef.label}</h2>
          {!compact ? <p>{typeDef.description}</p> : null}
        </div>
        {typeDef.fields.map((f) => renderField(f, content))}
      </section>
      <SaveBar status={status} message={message} cancelHref={cancelHref} />
    </form>
  );
}
