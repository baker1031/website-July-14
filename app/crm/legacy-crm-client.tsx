"use client";

import { useEffect, useRef } from "react";

type LegacyCrmClientProps = {
  markup: string;
  script: string;
  styles: string;
};

export default function LegacyCrmClient({
  markup,
  script,
  styles,
}: LegacyCrmClientProps) {
  const hasBooted = useRef(false);

  useEffect(() => {
    if (hasBooted.current || !script) return;
    hasBooted.current = true;

    try {
      // The existing CRM prototype is intentionally kept as the first migration
      // slice so its tested interactions continue working during the Next.js move.
      new Function(script)();
    } catch (error) {
      console.error("Baker 1031 CRM failed to initialize", error);
    }
  }, [script]);

  return (
    <div className="baker-crm-route">
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <div dangerouslySetInnerHTML={{ __html: markup }} />
    </div>
  );
}
