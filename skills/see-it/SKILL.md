---
name: see-it
description: Turn text, code, a PR or diff, a design doc, config, or anything else into layered Mermaid diagrams, from an overview down to detail, each readable at a glance. Diagrams only, no prose. Use when the user says "see it", "diagram this", "draw this", "visualize this", "help me understand this", or "help me understand this diff".
---

# see-it

Turn the input into diagrams that show what it is, from the big picture down to detail. Diagrams only, no prose.

1. Read the input from wherever it is (local files, a PR or commit, a doc, a URL, pasted text). Ask the user if something important is unclear. Do not change anything.
2. Draw it as described below. `templates/` has a starting point for each type and shared styles in `common.mmd`.
3. Write the diagrams to `_diagrams/<short-name>.md` at the repo root: a `## <question>?` title per diagram, the mermaid block, and links to the sources. See `references/tips.md` for link pitfalls.
4. For a diff, show changes in one diagram first: green added, red dashed removed, yellow changed. Then add an as-is diagram and a to-be diagram to compare, with the same node IDs in both. Skip the comparison for small diffs.
5. Check it renders with `node <this skill dir>/scripts/validate.mjs <file>`, fix until it passes, and reply with the file path.

## How to draw

- Start with one overview at the coarsest level where the subject is visible.
- Keep each diagram readable at a glance. When a part has more detail, collapse it into one node, then draw that node as the next diagram, one level down (system → components → code). Stop when it no longer helps.
- Pick the type by what the reader needs to know: states → `stateDiagram-v2`, call order → `sequenceDiagram`, data → `erDiagram`, types → `classDiagram`, flow → `flowchart`, dependencies → `flowchart LR`, infra → `flowchart` + `subgraph`, over time → `timeline`.
- With 3 or more diagrams, start with a `## Map`: a small flowchart of the diagram titles, each edge labeled with the node it expands.
- Labels are short phrases, never sentences.
