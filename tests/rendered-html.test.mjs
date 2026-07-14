import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server-renders the Property Exchange homepage", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>Property Exchange \| Build confidence for your next exchange<\/title>/i);
  assert.match(html, /Build confidence for your next exchange\./);
  assert.match(html, /Request Investment Access/);
  assert.match(html, /Strategies built around your goals\./);
  assert.match(html, /Full-Cycle Investments/);
  assert.match(html, /About our firm/);
  assert.match(html, /Frequently Asked Questions/);
});

test("keeps the homepage responsive and scroll-aware", async () => {
  const [page, css, notes] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(new URL("../PROJECT-NOTES.md", import.meta.url), "utf8"),
  ]);

  assert.match(page, /data-cycle-row/);
  assert.match(page, /VIDEO_SOURCE/);
  assert.match(page, /activeGoal/);
  assert.match(css, /grid-template-columns: repeat\(5, minmax\(0, 1fr\)\)/);
  assert.match(css, /@media \(max-width: 600px\)/);
  assert.match(notes, /This is a fresh start/);
});
