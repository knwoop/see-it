---
name: see-it
description: Help a developer understand code under review by turning a PR, diff, code, design doc, or infra config (Kubernetes, Terraform) into Mermaid diagrams. Diagrams only, no prose. Use when the user says "see it", "diagram this PR", "visualize this diff", "help me understand this change", or "draw how this code works".
---

# see-it

Turn development work under review into diagrams that show what it is. Diagrams only, no prose.

1. Read the input from wherever it is (local files, a PR or commit, a design doc, a URL, pasted text). Ask the user if something important is unclear. Do not change anything.
2. Draw as few diagrams as it takes, in whatever Mermaid types fit best. `templates/` has a starting point for each type and shared styles in `common.mmd`.
3. Write them to `_diagrams/<short-name>.md` at the repo root: a `## <question>?` title per diagram, the mermaid block, and links to the sources.
4. For a diff, show changes in one diagram: green added, red dashed removed, yellow changed.
5. Check it renders with `node <this skill dir>/scripts/validate.mjs <file>`, fix until it passes, and reply with the file path.
