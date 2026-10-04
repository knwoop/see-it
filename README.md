# see-it

A Claude Code skill that turns text, code, a PR or diff, a PDF, config, or anything else into Mermaid diagrams. Diagrams only, no prose.

## Install

```sh
/plugin marketplace add knwoop/see-it
/plugin install see-it@see-it
```

## Use

Ask Claude Code "see it", "diagram this", or "visualize this PR". The skill writes `_diagrams/<name>.md` at the repo root and replies with the path.

## Customize

Styles live in `skills/see-it/templates/`. Edit `common.mmd` to change colors for everything.

## Examples

| Input | Output |
|---|---|
| [Doc excerpt](examples/doc-excerpt/job-lifecycle.md) | [_diagrams/job-lifecycle-states.md](_diagrams/job-lifecycle-states.md) |
| [Code change](examples/code-change/) | [_diagrams/examples-code-change.md](_diagrams/examples-code-change.md) |
| [Kubernetes change](examples/k8s-change/) | [_diagrams/examples-k8s-change.md](_diagrams/examples-k8s-change.md) |
