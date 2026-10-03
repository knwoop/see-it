# Output file rules

## Location

`_diagrams/<target-slug>.md` at the root of the repo being reviewed (`git rev-parse --show-toplevel`). Outside a git repo, use the current directory. Re-running on the same target overwrites the file.

## Slug

Lowercase kebab-case, ASCII only.

| Target | Slug |
|---|---|
| PR | `pr-<number>` |
| Branch diff | branch name, `/` → `-` (e.g. `feat-retry`) |
| Single file | path without extension, `/` → `-` (e.g. `src-retry`) |
| Several files | deepest common directory, or the branch name if none |
| Excerpt | the subject in 2-4 words (e.g. `job-retry-states`) |
| Helm / Kustomize / Terraform dir | the directory path, `/` → `-` |

## File structure

~~~
## Legend                 <- only when any diagram uses diff styling; always first
```mermaid
(templates/common.mmd, comments stripped, unused classes removed)
```

## <question the diagram answers>?
```mermaid
...
```
1. [path/to/file.go#L12](../path/to/file.go#L12)
2. [path/to/file.go#L40-L58](../path/to/file.go#L40-L58)

## <next question>?
...
~~~

## Allowed text

Only these, nothing else:

- `## Legend`, once, first, only with diff styling.
- `## <title>`: the question the diagram answers, ending in `?`. Examples: `When does retry stop?`, `What calls the cache?`, `What changes in the web Deployment?`. Append ` (from diff only)` when a tool fell back to the diff.
- One mermaid block per title.
- A numbered source list under each block.

Inside diagrams:

- Node, edge, and `Note` labels are nouns or short phrases. Never sentences. No trailing periods.
- Use the source's own identifiers (function, type, resource names) as labels when they exist.
- No `%%` comments in the output.

## Numbering and sources

- Number the nodes a reviewer would want to jump to: `(N) ` at the start of the label. Sequence diagrams use `autonumber` and every message gets a source.
- Numbers restart at 1 in each diagram.
- Source item N links to where node N is defined: `N. [path#Lx](../path#Lx)` or a range `#Lx-Ly`. Paths are relative to `_diagrams/`, so they start with `../`.
- For a change, use line numbers from the after side. For removed nodes, use the before side's line.
- ER diagrams cannot carry numbers. List one source per entity in declaration order.
- Excerpt with no known origin file: no numbers, no source list.
- Boundary nodes are not numbered.
