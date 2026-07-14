import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { Metadata } from "next";
import LegacyCrmClient from "./legacy-crm-client";

export const metadata: Metadata = {
  title: "Baker 1031 CRM",
  description: "Baker 1031 client relationship management workspace.",
};

function loadLegacyCrm() {
  const source = readFileSync(
    join(process.cwd(), "crm-contact-mockup.html"),
    "utf8",
  );
  const styles = source.match(/<style>([\s\S]*?)<\/style>/i)?.[1] ?? "";
  const markup = source.match(/<body[^>]*>([\s\S]*?)<script>/i)?.[1] ?? "";
  const script = source.match(/<script>([\s\S]*?)<\/script>/i)?.[1] ?? "";

  return { markup, script, styles };
}

export default function CrmPage() {
  const crm = loadLegacyCrm();

  return <LegacyCrmClient {...crm} />;
}
