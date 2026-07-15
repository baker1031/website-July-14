"use client";

import { useEffect, useRef } from "react";
import type { LegacyDocument } from "../_lib/legacy-page";

export default function LegacyPage({ legacyDocument }: { legacyDocument: LegacyDocument }) {
  const htmlRef = useRef<HTMLDivElement>(null);
  const scriptRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const previousSitePage = document.body.dataset.sitePage;
    if (legacyDocument.sitePage) document.body.dataset.sitePage = legacyDocument.sitePage;

    const scriptHost = scriptRef.current;
    if (!scriptHost) return undefined;

    const scripts = legacyDocument.scripts.map((source) => {
      const script = document.createElement("script");
      script.textContent = source;
      scriptHost.appendChild(script);
      return script;
    });

    return () => {
      scripts.forEach((script) => script.remove());
      if (previousSitePage) document.body.dataset.sitePage = previousSitePage;
      else delete document.body.dataset.sitePage;
    };
  }, [legacyDocument]);

  return (
    <div className="legacy-page">
      {legacyDocument.styles.map((style, index) => (
        <style key={index} dangerouslySetInnerHTML={{ __html: style }} />
      ))}
      <div ref={htmlRef} dangerouslySetInnerHTML={{ __html: legacyDocument.bodyHtml }} />
      <div ref={scriptRef} aria-hidden="true" />
    </div>
  );
}
