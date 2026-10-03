---
name: see-it
description: Turn a doc excerpt, code, a file, several files, a PR or diff, Kubernetes manifests (raw, Helm, Kustomize), or Terraform into 1-3 Mermaid diagrams so a reviewer understands what it is, fast. Diagrams only, no prose. Use when the user says "see it", "see-it this", "diagram this", "draw this", "visualize this PR", "visualize this doc", "visualize this manifest", "help me understand this diff", "what does this change look like", "as-is to-be", or "before and after diagram".
---

# see-it

Produce diagrams that show **what** something is. Never why, never alternatives, never risks.

## Read-only

This skill never changes infrastructure or remote state. Never run `terraform apply`, `terraform destroy`, `terraform import`, `terraform state *`, `terraform init` in the user's tree, `kubectl apply`, `kubectl delete`, `kubectl edit`, `helm install`, `helm upgrade`, `helm uninstall`, or anything else that writes state or remote resources. The only file this skill writes in the user's repo is `_diagrams/<target-slug>.md`. Scratch work (base checkouts, rendered manifests, plan files) goes in a temp directory.

## Workflow

1. **Identify the target and slug.** See [references/output.md](references/output.md#slug).
2. **Gather facts.** Read the input and any surrounding files needed to understand it. For a change, get both sides (before and after). For Helm, Kustomize, or Terraform, run the read-only tools in [references/infra.md](references/infra.md) and build the diagrams from their output. If a tool is missing or fails, use the file diff and append ` (from diff only)` to that diagram's title.
3. **Choose 1-3 diagrams.** Follow [references/diagram-selection.md](references/diagram-selection.md).
4. **Draw from the templates.** Start every diagram from `templates/<type>.mmd` and copy the `classDef` lines from `templates/common.mmd`. Follow the `%%` conventions in each template, then strip all `%%` comments from the output.
5. **Write the file** to `_diagrams/<target-slug>.md` at the repo root, overwriting any previous run. Follow the text rules in [references/output.md](references/output.md).
6. **Validate** and fix until it passes:
   ```sh
   node <this skill dir>/scripts/validate.mjs _diagrams/<target-slug>.md
   ```
   The validator renders every block with mermaid-cli and checks titles, prose, numbering, and source links. Also look at each diagram once: if it is not readable at a glance (over ~15 nodes, or crossing edges you have to trace), split it.
7. **Reply with the file path only.** No summary, no commentary.

## Templates

| Subject | Template |
|---|---|
| Shared styles, legend, markers, numbering | `templates/common.mmd` |
| State changes | `templates/state.mmd` |
| Who calls whom, in what order | `templates/sequence.mmd` |
| Data shape and relations | `templates/er.mmd` |
| Types, inheritance, interfaces | `templates/class.mmd` |
| Process flow, branching | `templates/flowchart.mmd` |
| Dependencies, blast radius | `templates/dependency.mmd` |
| Config hierarchy, override precedence | `templates/tree.mmd` |
| Lifecycle over time | `templates/timeline.mmd`, `templates/gantt.mmd` |
| Infra topology | `templates/resource-graph.mmd` |
