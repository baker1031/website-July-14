import { readFile } from "node:fs/promises";
import path from "node:path";
import { cache } from "react";

export type LegacyDocument = {
  bodyHtml: string;
  styles: string[];
  scripts: string[];
  sitePage: string;
};

const scriptPattern = /<script\b([^>]*)>([\s\S]*?)<\/script>/gi;
const stylePattern = /<style\b[^>]*>([\s\S]*?)<\/style>/gi;

function getAttribute(attributes: string, name: string) {
  const match = attributes.match(new RegExp(`${name}=["']([^"']+)["']`, "i"));
  return match?.[1] ?? null;
}

export const loadLegacyPage = cache(async (filename: string, sitePage = ""): Promise<LegacyDocument> => {
  const source = await readFile(path.join(process.cwd(), filename), "utf8");
  const bodyMatch = source.match(/<body\b[^>]*>([\s\S]*?)<\/body>/i);
  const bodySource = bodyMatch?.[1] ?? source;
  const styles = Array.from(source.matchAll(stylePattern), (match) => match[1]);
  const scripts: string[] = [];

  for (const match of source.matchAll(scriptPattern)) {
    const sourcePath = getAttribute(match[1], "src");
    if (sourcePath) {
      const localPath = sourcePath.replace(/^\.\//, "").replace(/^\//, "");
      scripts.push(await readFile(path.join(process.cwd(), localPath), "utf8"));
    } else if (match[2].trim()) {
      scripts.push(match[2]);
    }
  }

  return {
    bodyHtml: bodySource.replace(scriptPattern, ""),
    styles,
    scripts,
    sitePage,
  };
});
