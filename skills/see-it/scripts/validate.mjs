#!/usr/bin/env node
// Check that every mermaid block in a markdown file renders.
// Usage: node validate.mjs <file.md>

import { mkdtempSync, rmSync } from "node:fs";
import { resolve, join } from "node:path";
import { tmpdir } from "node:os";
import { spawnSync } from "node:child_process";

const file = process.argv[2];
if (!file) {
  console.error("usage: node validate.mjs <file.md>");
  process.exit(2);
}

const tmp = mkdtempSync(join(tmpdir(), "see-it-"));
const r = spawnSync("npx", ["-y", "-p", "@mermaid-js/mermaid-cli@11", "mmdc", "-q", "-i", resolve(file), "-o", join(tmp, "out.md")], {
  encoding: "utf8",
});
rmSync(tmp, { recursive: true, force: true });

if (r.error || r.status !== 0) {
  console.log(`FAIL: ${r.error ? r.error.message : r.stderr || r.stdout}`);
  process.exit(1);
}
console.log(`ok: ${file}`);
