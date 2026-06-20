"use client";

import { useState, useEffect } from "react";

// Live previews for the SEO form. Listens for input events on the form fields
// (by id) so we don't have to lift state into the parent server component.

type Snapshot = {
  metaTitle: string;
  metaDescription: string;
  ogTitle: string;
  ogDescription: string;
  canonicalPath: string;
};

const SITE = "https://www.haney-group.com";

function useFormSnapshot(
  fallback: Snapshot,
  pathHint: string
): Snapshot & { url: string } {
  const [snap, setSnap] = useState<Snapshot>(fallback);
  useEffect(() => {
    function read(id: string): string {
      const el = document.getElementById(id) as
        | HTMLInputElement
        | HTMLTextAreaElement
        | null;
      return el?.value ?? "";
    }
    function update() {
      setSnap({
        metaTitle: read("meta_title") || fallback.metaTitle,
        metaDescription: read("meta_description") || fallback.metaDescription,
        ogTitle: read("og_title") || read("meta_title") || fallback.metaTitle,
        ogDescription:
          read("og_description") || read("meta_description") || fallback.metaDescription,
        canonicalPath: read("canonical_path") || fallback.canonicalPath,
      });
    }
    const fields = [
      "meta_title",
      "meta_description",
      "og_title",
      "og_description",
      "canonical_path",
    ];
    const els = fields
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));
    els.forEach((el) => el.addEventListener("input", update));
    update();
    return () => {
      els.forEach((el) => el.removeEventListener("input", update));
    };
  }, [fallback.metaTitle, fallback.metaDescription, fallback.canonicalPath]);

  const path = snap.canonicalPath || pathHint;
  const url = path.startsWith("http") ? path : `${SITE}${path.startsWith("/") ? "" : "/"}${path}`;
  return { ...snap, url };
}

export function SeoPreviews({
  initial,
  pathHint,
  ogImageUrl,
}: {
  initial: Snapshot;
  pathHint: string;
  ogImageUrl?: string;
}) {
  const snap = useFormSnapshot(initial, pathHint);

  return (
    <div className="seopreview">
      <p className="adminform__section-eyebrow" style={{ marginBottom: 10 }}>
        Previews
      </p>

      <div className="seopreview__card seopreview__google">
        <div className="seopreview__google-label">Google search</div>
        <div className="seopreview__google-url">
          {snap.url.replace(/^https?:\/\//, "")}
        </div>
        <div className="seopreview__google-title">{snap.metaTitle}</div>
        <div className="seopreview__google-desc">{snap.metaDescription}</div>
      </div>

      <div className="seopreview__card seopreview__social">
        <div className="seopreview__google-label">Social card (LinkedIn / X)</div>
        {ogImageUrl ? (
          <div className="seopreview__social-img">
            <img src={ogImageUrl} alt="" />
          </div>
        ) : (
          <div className="seopreview__social-img seopreview__social-img--empty">
            No social image set — global default will be used.
          </div>
        )}
        <div className="seopreview__social-body">
          <div className="seopreview__social-host">
            {snap.url.replace(/^https?:\/\//, "").split("/")[0]}
          </div>
          <div className="seopreview__social-title">{snap.ogTitle}</div>
          <div className="seopreview__social-desc">{snap.ogDescription}</div>
        </div>
      </div>
    </div>
  );
}
