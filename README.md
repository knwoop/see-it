# see-it

An [Agent Skill](https://agentskills.io) that turns text, code, a PR or diff, a design doc, config, or anything else into Mermaid diagrams you can read at a glance. It starts with an overview and draws each detailed part as its own diagram one level down. Diagrams only, no prose.

## Install

Copy `skills/see-it/` into the skills directory of any agent that supports Agent Skills.

Or install it as a plugin:

```sh
/plugin marketplace add knwoop/see-it
/plugin install see-it@see-it
```

## Use

Ask your agent "see it", "diagram this", or "help me understand this diff". The skill writes `_diagrams/<name>.md` at the repo root and replies with the path.

## Customize

Styles live in `skills/see-it/templates/`. Edit `common.mmd` to change colors for everything.

## Examples

| Input | Output |
|---|---|
| [Doc excerpt](examples/doc-excerpt/job-lifecycle.md) | [_diagrams/job-lifecycle-states.md](_diagrams/job-lifecycle-states.md) |
| [Code change](examples/code-change/) | [_diagrams/examples-code-change.md](_diagrams/examples-code-change.md) |
| [Kubernetes change](examples/k8s-change/) | [_diagrams/examples-k8s-change.md](_diagrams/examples-k8s-change.md) |
