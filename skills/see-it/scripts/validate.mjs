#!/usr/bin/env node
// Validate a see-it output file.
// Usage: node validate.mjs <path/to/_diagrams/slug.md>
// Exits non-zero and prints every problem when the file breaks a rule.

import { readFileSync, existsSync, mkdtempSync, rmSync } from "node:fs";
import { dirname, resolve, join } from "node:path";
import { tmpdir } from "node:os";
import { spawnSync } from "node:child_process";

const MMDC_PKG = "@mermaid-js/mermaid-cli@11";

const file = process.argv[2];
if (!file) {
  console.error("usage: node validate.mjs <file.md>");
  process.exit(2);
}

const errors = [];
const warnings = [];
const lines = readFileSync(file, "utf8").split("\n");

// --- Parse into sections: heading, mermaid block, source list ---

const sections = [];
let current = null;
let inFence = false;

lines.forEach((line, i) => {
  const n = i + 1;
  if (inFence) {
    if (line.trim() === "```") {
      inFence = false;
    } else {
      current.code.push(line);
    }
    return;
  }
  if (line.trim() === "") return;
  if (line.startsWith("## ")) {
    current = { title: line.slice(3).trim(), line: n, code: [], sources: [], fences: 0 };
    sections.push(current);
    return;
  }
  if (line.trim() === "```mermaid") {
    if (!current) {
      errors.push(`line ${n}: mermaid block before any "## " title`);
      current = { title: "", line: n, code: [], sources: [], fences: 0 };
      sections.push(current);
    }
    current.fences++;
    inFence = true;
    return;
  }
  const src = line.match(/^(\d+)\. \[([^\]]+)\]\(([^)\s]+)\)$/);
  if (src && current) {
    current.sources.push({ num: Number(src[1]), text: src[2], url: src[3], line: n });
    return;
  }
  errors.push(`line ${n}: text outside a title, diagram, or source list: "${line.trim()}"`);
});

if (inFence) errors.push("unclosed ``` fence");

// --- Structure rules ---

const legend = sections.filter((s) => s.title === "Legend");
const diagrams = sections.filter((s) => s.title !== "Legend");

if (legend.length > 1) errors.push("more than one Legend section");
if (legend.length === 1 && sections[0] !== legend[0]) errors.push("Legend must be the first section");
if (diagrams.length < 1 || diagrams.length > 3) {
  errors.push(`expected 1-3 diagrams (Legend excluded), found ${diagrams.length}`);
}

for (const s of sections) {
  if (s.fences !== 1) errors.push(`line ${s.line}: section "${s.title}" must have exactly one mermaid block, found ${s.fences}`);
}

const DIFF_USE = /:::(added|removed|changed|replace)\b|^\s*class\s+\S+\s+(added|removed|changed|replace)\b|^\s*rect\s+rgba/m;
const anyDiff = diagrams.some((s) => DIFF_USE.test(s.code.join("\n")));
if (anyDiff && legend.length === 0) errors.push("diff styling used but no Legend section");

// --- Per-diagram rules ---

const mdDir = dirname(resolve(file));

for (const s of diagrams) {
  const where = `line ${s.line} "${s.title}"`;

  if (!/\?( \(from diff only\))?$/.test(s.title)) {
    errors.push(`${where}: title must be a question ending in "?" (optionally followed by " (from diff only)")`);
  }

  const body = s.code.filter((l) => !l.trim().startsWith("%%"));
  if (body.length !== s.code.length) errors.push(`${where}: strip %% comments from output`);
  const kind = (body.find((l) => l.trim() !== "") || "").trim().split(/\s+/)[0];

  // Numbers used in the diagram.
  let used = new Set();
  if (kind === "sequenceDiagram") {
    if (body.some((l) => l.trim() === "autonumber")) {
      const msg = /^\s*[^%\s][^:]*?(-->>|->>|-->|->|--x|-x|--\)|-\))[+-]?[^:]*:/;
      const count = body.filter((l) => msg.test(l)).length;
      for (let i = 1; i <= count; i++) used.add(i);
    } else {
      errors.push(`${where}: sequenceDiagram must use autonumber`);
    }
  } else if (kind === "erDiagram") {
    used = null; // ER entities cannot carry numbers; sources follow entity order.
  } else {
    for (const l of body) {
      for (const m of l.matchAll(/(^|["\[(\s:>])\((\d+)\)\s/g)) used.add(Number(m[2]));
    }
  }

  const listed = new Set(s.sources.map((x) => x.num));
  if (used) {
    for (const n of [...used].sort((a, b) => a - b)) {
      if (!listed.has(n)) errors.push(`${where}: number (${n}) has no source link`);
    }
    for (const n of [...listed].sort((a, b) => a - b)) {
      if (!used.has(n)) errors.push(`${where}: source ${n} matches no number in the diagram`);
    }
  }

  for (const x of s.sources) {
    if (/^https?:\/\//.test(x.url)) continue;
    if (!/#L\d+(-L\d+)?$/.test(x.url)) {
      errors.push(`line ${x.line}: source link must end in #L<line> or #L<a>-L<b>: ${x.url}`);
      continue;
    }
    const target = resolve(mdDir, x.url.replace(/#.*$/, ""));
    if (!existsSync(target)) warnings.push(`line ${x.line}: source file not found (ok only for deleted files): ${x.url}`);
  }
}

// --- Render every block with mermaid-cli ---

const tmp = mkdtempSync(join(tmpdir(), "see-it-"));
const r = spawnSync("npx", ["-y", "-p", MMDC_PKG, "mmdc", "-q", "-i", resolve(file), "-o", join(tmp, "out.md")], {
  encoding: "utf8",
});
if (r.error) {
  errors.push(`could not run mermaid-cli: ${r.error.message}`);
} else if (r.status !== 0) {
  const msg = (r.stderr || r.stdout).split("\n").filter((l) => /error|expecting|\^/i.test(l) && !/parseError \(/.test(l)).slice(0, 8).join("\n  ");
  errors.push(`mermaid render failed:\n  ${msg}`);
}
rmSync(tmp, { recursive: true, force: true });

// --- Report ---

for (const w of warnings) console.log(`warn: ${w}`);
if (errors.length) {
  for (const e of errors) console.log(`FAIL: ${e}`);
  process.exit(1);
}
console.log(`ok: ${file} (${diagrams.length} diagram${diagrams.length === 1 ? "" : "s"})`);
