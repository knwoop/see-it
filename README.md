# see-it

A Claude Code skill that turns a doc excerpt, code, a PR or diff, Kubernetes manifests (raw, Helm, Kustomize), or Terraform into 1-3 Mermaid diagrams. It helps a reviewer understand **what** something is, fast. Diagrams only, no prose. Rationale, alternatives, and risks are out of scope.

## Install

```sh
/plugin marketplace add knwoop/see-it
/plugin install see-it@see-it
```

## Use

Ask Claude Code things like:

- "see it: `src/retry.go`"
- "diagram this section" (with a doc excerpt)
- "visualize this PR"
- "help me understand this diff"
- "as-is to-be for `deploy/overlays/prod`"

The skill writes `_diagrams/<target-slug>.md` at the repo root and replies with the path.

## Output rules

- Titles are the question each diagram answers.
- Labels are nouns or short phrases.
- Numbered nodes link to `file#Lline` in a source list under each diagram.
- Changes get a merged diagram first: green `+` added, red dashed `-` removed, yellow `~` changed, orange `-/+` Terraform replace, grey boundary.

## Read-only

The skill only runs read-only commands: `helm template`, `kustomize build`, `terraform plan -lock=false` (only in an already-initialized directory), `terraform show -json`, and `terraform graph`. It never runs `apply`, `destroy`, `init` in your tree, or anything that writes state or remote resources. If a tool is unavailable, it uses the file diff and marks the diagram `(from diff only)`.

## Customize

All styling lives in `skills/see-it/templates/`. Edit `common.mmd` to restyle colors, the legend, and markers. Each diagram type has its own template with conventions in `%%` comments.

## Validate

```sh
node skills/see-it/scripts/validate.mjs _diagrams/<slug>.md
```

This renders every block with `@mermaid-js/mermaid-cli@11` (the first run downloads Chromium) and checks titles, prose, diagram count, numbering, and source links.

## Examples

| Input | Output |
|---|---|
| [Doc excerpt with a state machine](examples/doc-excerpt/job-lifecycle.md) | [_diagrams/job-lifecycle-states.md](_diagrams/job-lifecycle-states.md) |
| [Code change](examples/code-change/) (`before/` → `after/`) | [_diagrams/examples-code-change.md](_diagrams/examples-code-change.md) |
| [Kubernetes manifest change](examples/k8s-change/) (`before/` → `after/`) | [_diagrams/examples-k8s-change.md](_diagrams/examples-k8s-change.md) |

The outputs are reference examples, not exact regression targets. Model output varies between runs.

## Layout

```
.claude-plugin/plugin.json
.claude-plugin/marketplace.json
skills/see-it/SKILL.md
skills/see-it/templates/*.mmd
skills/see-it/references/   # diagram selection, output rules, infra rules
skills/see-it/scripts/validate.mjs
examples/                   # sample inputs
_diagrams/                  # golden outputs for the examples
```
