# Choosing diagrams

## Count

1-3 diagrams per file. The Legend does not count.

| Input | Diagrams |
|---|---|
| Excerpt | 1 |
| Single file | 1-3 |
| Several files / PR | 1 overview, then up to 2 focused details |

## Order

1. Start at the coarsest level where the subject (or change) is visible.
2. When order is unclear, go from large to small granularity: system → containers → components → code. This is a tiebreak only. Do not build a full C4 mapping.
3. If a diagram is not readable at a glance, split it rather than enlarge it, within the 3-diagram cap. If it still does not fit, zoom out one level.

## Type by subject

| Subject | Diagram | Mermaid | Template |
|---|---|---|---|
| State changes | State machine | `stateDiagram-v2` | `state.mmd` |
| Who calls whom, in what order | Sequence | `sequenceDiagram` | `sequence.mmd` |
| Data shape and relations | ER | `erDiagram` | `er.mmd` |
| Types, inheritance, interfaces | Class | `classDiagram` | `class.mmd` |
| Process flow, branching | Flowchart | `flowchart TD` | `flowchart.mmd` |
| Dependencies, blast radius | Dependency graph | `flowchart LR` | `dependency.mmd` |
| Config hierarchy, override precedence | Tree | `flowchart TD` | `tree.mmd` |
| Lifecycle over time | Timeline | `timeline` / `gantt` | `timeline.mmd`, `gantt.mmd` |
| Infra topology | Resource graph | `flowchart` + `subgraph` | `resource-graph.mmd` |

Use `flowchart` + `subgraph` instead of Mermaid's experimental `C4*` syntax.

## Scope

- Draw what the input covers. Read surrounding files when needed to get it right.
- Things the subject references but that are not part of it become grey boundary nodes (`:::boundary`). Do not expand them.

## Changes (any diff, code or config)

1. The first diagram is one merged diagram with diff styling. Use a type that supports it:
   - `flowchart`, `stateDiagram-v2`, `classDiagram`, `erDiagram`: classes from `common.mmd`.
   - `sequenceDiagram`: `rect rgba(...)` blocks (see `sequence.mmd`).
   - `timeline`, `gantt`: markers only.
2. Every styled node also carries its label marker: `+` added, `-` removed, `~` changed, `-/+` or `+/-` replaced.
3. For larger structural changes, follow with an as-is diagram and a to-be diagram. Use identical node IDs in both.
4. Add the Legend section.

## Config changes

| Change | Diagram |
|---|---|
| Structural: new Service, routing, new resource | Resource graph |
| Value-only: replicas, resources, probes | Resource graph with `field: old → new` on the node |
| Rollout strategy (`maxSurge`, `maxUnavailable`, `strategy.type`) | Sequence or timeline of the rollout |
| Probes | Pod state machine |
| HPA | Flowchart of the scaling decision |

A behavior-changing value gets the behavior diagram in addition to the value diagram.
