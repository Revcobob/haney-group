"use client";

import { useState } from "react";
import { FieldShell } from "./Fields";

// Text input / textarea with a live character counter, colored when it
// crosses the soft-recommended limit. Used in SEO meta forms.

export function CountedTextField({
  id,
  name,
  label,
  help,
  error,
  defaultValue,
  placeholder,
  recommendedMax,
  onValueChange,
}: {
  id: string;
  name: string;
  label: string;
  help?: string;
  error?: string;
  defaultValue?: string;
  placeholder?: string;
  recommendedMax: number;
  onValueChange?: (v: string) => void;
}) {
  const [value, setValue] = useState(defaultValue ?? "");
  const over = value.length > recommendedMax;
  return (
    <FieldShell id={id} label={label} help={help} error={error}>
      <input
        id={id}
        name={name}
        type="text"
        className="adminfield__input"
        defaultValue={defaultValue}
        placeholder={placeholder}
        onChange={(e) => {
          setValue(e.target.value);
          onValueChange?.(e.target.value);
        }}
        autoComplete="off"
      />
      <p
        className={`adminfield__count${over ? " adminfield__count--over" : ""}`}
        aria-live="polite"
      >
        {value.length} / {recommendedMax} characters
        {over ? " · over recommended length" : ""}
      </p>
    </FieldShell>
  );
}

export function CountedTextareaField({
  id,
  name,
  label,
  help,
  error,
  defaultValue,
  placeholder,
  rows = 3,
  recommendedMax,
  onValueChange,
}: {
  id: string;
  name: string;
  label: string;
  help?: string;
  error?: string;
  defaultValue?: string;
  placeholder?: string;
  rows?: number;
  recommendedMax: number;
  onValueChange?: (v: string) => void;
}) {
  const [value, setValue] = useState(defaultValue ?? "");
  const over = value.length > recommendedMax;
  return (
    <FieldShell id={id} label={label} help={help} error={error}>
      <textarea
        id={id}
        name={name}
        className="adminfield__textarea"
        rows={rows}
        defaultValue={defaultValue}
        placeholder={placeholder}
        onChange={(e) => {
          setValue(e.target.value);
          onValueChange?.(e.target.value);
        }}
      />
      <p
        className={`adminfield__count${over ? " adminfield__count--over" : ""}`}
        aria-live="polite"
      >
        {value.length} / {recommendedMax} characters
        {over ? " · over recommended length" : ""}
      </p>
    </FieldShell>
  );
}
