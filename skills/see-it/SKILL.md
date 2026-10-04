---
name: see-it
description: Turn text, code, a PR or diff, a PDF, config, or anything else into Mermaid diagrams so a reviewer sees what it is, fast. Diagrams only, no prose. Use when the user says "see it", "diagram this", "draw this", "visualize this", or "help me understand this diff".
---

# see-it

Turn the input into diagrams that show what it is. Diagrams only, no prose.

1. Read the input from wherever it is (local files, a PR, a PDF, a URL, pasted text). Ask the user if something important is unclear. Do not change anything.
2. Draw as few diagrams as it takes, in whatever Mermaid types fit best. `templates/` has a starting point for each type and shared styles in `common.mmd`.
3. Write them to `_diagrams/<short-name>.md` at the repo root: a `## <question>?` title per diagram, the mermaid block, and links to the sources.
4. For a diff, show changes in one diagram: green added, red dashed removed, yellow changed.
5. Check it renders with `node <this skill dir>/scripts/validate.mjs <file>`, fix until it passes, and reply with the file path.
