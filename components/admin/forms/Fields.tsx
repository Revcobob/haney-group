// Plain-language form primitives for the admin.
// Friendly labels, character counters, consistent styling.

import type { ReactNode } from "react";

type FieldShellProps = {
  id: string;
  label: string;
  help?: string;
  error?: string;
  children: ReactNode;
  required?: boolean;
};

export function FieldShell({
  id,
  label,
  help,
  error,
  children,
  required,
}: FieldShellProps) {
  return (
    <div className="adminfield">
      <label className="adminfield__label" htmlFor={id}>
        {label}
        {required ? <span aria-hidden="true" style={{ color: "var(--amber-600)", marginLeft: 4 }}>*</span> : null}
      </label>
      {children}
      {help && !error ? <p className="adminfield__help">{help}</p> : null}
      {error ? (
        <p className="adminfield__error" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

type TextFieldProps = {
  id: string;
  name: string;
  label: string;
  help?: string;
  error?: string;
  required?: boolean;
  placeholder?: string;
  defaultValue?: string;
  maxLength?: number;
  type?: "text" | "url" | "email" | "tel";
  autoComplete?: string;
};

export function TextField(props: TextFieldProps) {
  return (
    <FieldShell
      id={props.id}
      label={props.label}
      help={props.help}
      error={props.error}
      required={props.required}
    >
      <input
        id={props.id}
        name={props.name}
        type={props.type ?? "text"}
        className="adminfield__input"
        required={props.required}
        placeholder={props.placeholder}
        defaultValue={props.defaultValue}
        maxLength={props.maxLength}
        autoComplete={props.autoComplete ?? "off"}
      />
    </FieldShell>
  );
}

type TextareaFieldProps = {
  id: string;
  name: string;
  label: string;
  help?: string;
  error?: string;
  required?: boolean;
  placeholder?: string;
  defaultValue?: string;
  rows?: number;
  maxLength?: number;
};

export function TextareaField(props: TextareaFieldProps) {
  return (
    <FieldShell
      id={props.id}
      label={props.label}
      help={props.help}
      error={props.error}
      required={props.required}
    >
      <textarea
        id={props.id}
        name={props.name}
        className="adminfield__textarea"
        required={props.required}
        placeholder={props.placeholder}
        defaultValue={props.defaultValue}
        rows={props.rows ?? 4}
        maxLength={props.maxLength}
      />
    </FieldShell>
  );
}

type SelectFieldProps = {
  id: string;
  name: string;
  label: string;
  help?: string;
  error?: string;
  required?: boolean;
  defaultValue?: string;
  options: Array<{ value: string; label: string }>;
};

export function SelectField(props: SelectFieldProps) {
  return (
    <FieldShell
      id={props.id}
      label={props.label}
      help={props.help}
      error={props.error}
      required={props.required}
    >
      <select
        id={props.id}
        name={props.name}
        className="adminfield__select"
        defaultValue={props.defaultValue}
        required={props.required}
      >
        {props.options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </FieldShell>
  );
}

type ToggleFieldProps = {
  id: string;
  name: string;
  label: string;
  help?: string;
  defaultChecked?: boolean;
};

export function ToggleField(props: ToggleFieldProps) {
  return (
    <div className="adminfield adminfield--toggle">
      <label className="adminfield__toggle-row" htmlFor={props.id}>
        <input
          id={props.id}
          name={props.name}
          type="checkbox"
          className="adminfield__toggle"
          defaultChecked={props.defaultChecked}
        />
        <span>
          <span className="adminfield__label" style={{ marginBottom: 0 }}>
            {props.label}
          </span>
          {props.help ? <p className="adminfield__help">{props.help}</p> : null}
        </span>
      </label>
    </div>
  );
}
