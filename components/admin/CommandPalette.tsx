"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type Hit = {
  id: string;
  title: string;
  hint: string;
  href: string;
};

// Fuzzy filter without an external dep. Lowercase needle is required
// to match in order across the title + hint; exact substring matches
// score higher so "ser" prefers "Services" over "Press release".
function score(hit: Hit, needle: string): number {
  if (!needle) return 1;
  const hay = `${hit.title} · ${hit.hint}`.toLowerCase();
  if (hay.includes(needle)) {
    // Earlier matches rank higher; exact prefix on the title wins.
    const titlePrefix = hit.title.toLowerCase().startsWith(needle) ? 1000 : 0;
    return 500 + titlePrefix - hay.indexOf(needle);
  }
  // Subsequence fallback — every needle char in order.
  let i = 0;
  for (const c of hay) {
    if (c === needle[i]) i++;
    if (i === needle.length) return 1;
  }
  return 0;
}

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<Hit[] | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Global Cmd-K / Ctrl-K toggle.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const isMeta = e.metaKey || e.ctrlKey;
      if (isMeta && (e.key === "k" || e.key === "K")) {
        e.preventDefault();
        setOpen((v) => !v);
      } else if (e.key === "Escape" && open) {
        setOpen(false);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Lazy-load the index the first time the palette opens.
  useEffect(() => {
    if (!open || loaded) return;
    setLoaded(true);
    fetch("/api/admin/search")
      .then((r) => (r.ok ? r.json() : { items: [] }))
      .then((d: { items: Hit[] }) => setItems(d.items))
      .catch(() => setItems([]));
  }, [open, loaded]);

  // Focus the input when the modal opens.
  useEffect(() => {
    if (open) {
      setQuery("");
      setActive(0);
      // microtask so the input is in the DOM before focus
      queueMicrotask(() => inputRef.current?.focus());
    }
  }, [open]);

  const results = useMemo(() => {
    if (!items) return [];
    const needle = query.trim().toLowerCase();
    if (!needle) return items.slice(0, 40);
    return items
      .map((h) => ({ hit: h, s: score(h, needle) }))
      .filter((x) => x.s > 0)
      .sort((a, b) => b.s - a.s)
      .slice(0, 40)
      .map((x) => x.hit);
  }, [items, query]);

  // Clamp the active index when the result list shrinks.
  useEffect(() => {
    if (active >= results.length) setActive(Math.max(0, results.length - 1));
  }, [results, active]);

  function go(hit: Hit) {
    setOpen(false);
    router.push(hit.href);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(results.length - 1, i + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(0, i - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const hit = results[active];
      if (hit) go(hit);
    }
  }

  if (!open) return null;

  return (
    <div
      className="cmdk"
      role="dialog"
      aria-modal="true"
      aria-label="Search admin"
    >
      <div className="cmdk__backdrop" onClick={() => setOpen(false)} />
      <div className="cmdk__panel">
        <input
          ref={inputRef}
          type="search"
          placeholder="Jump to a page, section, article, service…"
          className="cmdk__input"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setActive(0);
          }}
          onKeyDown={onKeyDown}
          aria-autocomplete="list"
        />
        <div className="cmdk__hint">
          <span>↑↓ to move · Enter to open · Esc to close</span>
          <span>
            {items === null
              ? "Loading…"
              : `${results.length} of ${items.length}`}
          </span>
        </div>
        <ul className="cmdk__results" role="listbox">
          {results.length === 0 ? (
            <li className="cmdk__empty">No matches.</li>
          ) : (
            results.map((hit, i) => (
              <li
                key={hit.id}
                role="option"
                aria-selected={i === active}
                className={`cmdk__row${i === active ? " is-active" : ""}`}
                onMouseEnter={() => setActive(i)}
                onClick={() => go(hit)}
              >
                <span className="cmdk__row-title">{hit.title}</span>
                <span className="cmdk__row-hint">{hit.hint}</span>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
