"use client";

import { useActionState, useEffect, useRef, useState, useTransition } from "react";
import { useFormStatus } from "react-dom";
import { useUnsavedChangesGuard } from "./useUnsavedChangesGuard";
import {
  publishSectionDraftAction,
  discardSectionDraftAction,
} from "@/lib/admin/actions/sections";
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
import { ResetSectionButton } from "./ResetSectionButton";
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
  onPreviewChange,
  compact,
  hasDraft = false,
  draftUpdatedAt,
}: {
  typeDef: SectionTypeClient;
  content: Record<string, unknown>;
  action: Action;
  meta: SectionMeta;
  cancelHref?: string;
  onSaved?: () => void;
  /** Called with debounced text-field snapshots as the admin types,
   *  so the visual editor iframe can patch its DOM in place. */
  onPreviewChange?: (sectionKey: string, fields: Record<string, string>) => void;
  compact?: boolean;
  /** True when a saved draft is currently overlaying the live content. */
  hasDraft?: boolean;
  /** ISO timestamp of the most recent draft save. */
  draftUpdatedAt?: string | null;
}) {
  const [state, formAction] = useActionState<ActionResult | undefined, FormData>(
    action,
    undefined
  );
  const formRef = useRef<HTMLFormElement>(null);
  const { markClean } = useUnsavedChangesGuard(formRef);
  const status = !state ? "idle" : state.ok ? "success" : "error";
  const message = !state ? undefined : state.ok ? "Saved." : state.error;

  // Fire onSaved exactly once per state object — useActionState returns the
  // same reference until the next submit, so an identity check on `state`
  // prevents the iframe-reload from looping when the parent re-renders.
  const lastNotifiedState = useRef<typeof state | undefined>(undefined);
  useEffect(() => {
    if (state?.ok && lastNotifiedState.current !== state) {
      lastNotifiedState.current = state;
      markClean();
      onSaved?.();
    }
  }, [state, onSaved, markClean]);

  // Live-preview pipe. Watch the form for input/change events, debounce
  // 250ms, and forward a snapshot of plain text-field values to the
  // visual editor so its iframe can patch the rendered DOM in place.
  useEffect(() => {
    if (!onPreviewChange || !formRef.current) return;
    const form = formRef.current;
    let handle: number | null = null;
    function snapshot() {
      const fields: Record<string, string> = {};
      const ctrls = form.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>(
        'input[type="text"], input[type="email"], input[type="url"], textarea'
      );
      ctrls.forEach((el) => {
        const name = el.name;
        if (!name) return;
        // Skip meta context, nested / array fields, hidden picker IDs.
        if (name.startsWith("_meta_")) return;
        if (name.includes(".") || name.includes("[")) return;
        fields[name] = el.value;
      });
      onPreviewChange!(meta.sectionKey, fields);
    }
    function onInput() {
      if (handle) window.clearTimeout(handle);
      handle = window.setTimeout(snapshot, 250);
    }
    form.addEventListener("input", onInput);
    form.addEventListener("change", onInput);
    // Push the initial snapshot so the iframe immediately reflects what
    // the form is showing (helpful when a draft was preloaded).
    snapshot();
    return () => {
      form.removeEventListener("input", onInput);
      form.removeEventListener("change", onInput);
      if (handle) window.clearTimeout(handle);
    };
  }, [onPreviewChange, meta.sectionKey]);

  return (
    <form ref={formRef} action={formAction} className="adminform">
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

        {hasDraft && meta.pageId ? (
          <DraftNotice
            pageId={meta.pageId}
            pageSlug={meta.pageSlug}
            sectionKey={meta.sectionKey}
            sectionLabel={meta.sectionLabel}
            updatedAt={draftUpdatedAt ?? undefined}
            onChanged={onSaved}
          />
        ) : null}

        {typeDef.fields.map((f) => renderField(f, content))}
      </section>

      <div className="adminsavebar" role="status">
        {message ? (
          <span
            className={`adminsavebar__msg${
              status === "error"
                ? " adminsavebar__msg--error"
                : status === "success"
                ? " adminsavebar__msg--success"
                : ""
            }`}
          >
            {message}
          </span>
        ) : (
          <span />
        )}
        <div className="adminsavebar__actions">
          {meta.pageId ? (
            <span className="adminsavebar__secondary">
              <ResetSectionButton
                pageId={meta.pageId}
                pageSlug={meta.pageSlug}
                sectionKey={meta.sectionKey}
                sectionLabel={meta.sectionLabel}
                onReset={onSaved}
              />
            </span>
          ) : null}
          {cancelHref ? (
            <a className="adminbtn adminbtn--ghost" href={cancelHref}>
              Cancel
            </a>
          ) : null}
          <SectionSaveButtons />
        </div>
      </div>
    </form>
  );
}

// Two-state submit pair. Both buttons set _meta_publish via their own
// name/value pair so a single click decides whether the form writes to
// the draft column or to live content.
function SectionSaveButtons() {
  const { pending } = useFormStatus();
  return (
    <>
      <button
        type="submit"
        name="_meta_publish"
        value="0"
        className="adminbtn adminbtn--ghost"
        disabled={pending}
      >
        {pending ? "Saving…" : "Save draft"}
      </button>
      <button
        type="submit"
        name="_meta_publish"
        value="1"
        className="adminbtn adminbtn--primary"
        disabled={pending}
      >
        {pending ? "Saving…" : "Save and publish"}
      </button>
    </>
  );
}

function DraftNotice({
  pageId,
  pageSlug,
  sectionKey,
  sectionLabel,
  updatedAt,
  onChanged,
}: {
  pageId: string;
  pageSlug: string;
  sectionKey: string;
  sectionLabel: string;
  updatedAt?: string;
  onChanged?: () => void;
}) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function publish() {
    setError(null);
    startTransition(async () => {
      const r = await publishSectionDraftAction(pageId, pageSlug, sectionKey);
      if (!r.ok) {
        setError(r.error ?? "Publish failed");
        return;
      }
      onChanged?.();
    });
  }
  function discard() {
    if (
      !window.confirm(
        `Throw away the draft for "${sectionLabel}"? The live copy stays as it is.`
      )
    ) {
      return;
    }
    setError(null);
    startTransition(async () => {
      const r = await discardSectionDraftAction(pageId, pageSlug, sectionKey);
      if (!r.ok) {
        setError(r.error ?? "Discard failed");
        return;
      }
      onChanged?.();
    });
  }

  return (
    <div className="adminform__draftnotice" role="status">
      <div>
        <strong>You're editing a draft.</strong>
        <p>
          The public site is still showing the last-published version of this
          section.{" "}
          {updatedAt ? (
            <>
              Draft last saved{" "}
              <time dateTime={updatedAt}>
                {new Date(updatedAt).toLocaleString()}
              </time>
              .
            </>
          ) : null}
        </p>
      </div>
      <div className="adminform__draftnotice-actions">
        <button
          type="button"
          className="adminbtn adminbtn--primary adminbtn--small"
          onClick={publish}
          disabled={pending}
        >
          {pending ? "…" : "Publish draft"}
        </button>
        <button
          type="button"
          className="adminbtn adminbtn--ghost adminbtn--small"
          onClick={discard}
          disabled={pending}
        >
          Discard draft
        </button>
      </div>
      {error ? (
        <p
          className="adminfield__error"
          role="alert"
          style={{ marginTop: 8, gridColumn: "1 / -1" }}
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}
