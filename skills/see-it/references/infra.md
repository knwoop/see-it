# Infra rules

All commands here are read-only. Run them in a temp directory (`mktemp -d`). Never run `apply`, `destroy`, `import`, `state` subcommands, `kubectl apply`, or Helm release commands.

## Getting the before side

Export the base revision into the temp directory. Do not check out in the user's tree.

```sh
TMP=$(mktemp -d)
git archive <base-ref> <path> | tar -x -C "$TMP/before"
```

`<base-ref>`: the PR base (`gh pr view <n> --json baseRefName`), or `git merge-base HEAD origin/main` for a branch diff.

## Raw Kubernetes manifests

No render step. Diff the YAML documents directly, matching by `kind/namespace/name`.

## Helm

```sh
helm template <release> <before-chart-dir> -f <values...> > "$TMP/before.yaml"
helm template <release> <after-chart-dir>  -f <values...> > "$TMP/after.yaml"
diff -u "$TMP/before.yaml" "$TMP/after.yaml"
```

Use the values files the repo pairs with the chart (e.g. `values-<env>.yaml` beside it, or the ones a CI/Argo/Flux config references). If several environments exist and the user did not name one, use the default `values.yaml`.

## Kustomize

```sh
kustomize build <before-overlay> > "$TMP/before.yaml"   # or: kubectl kustomize
kustomize build <after-overlay>  > "$TMP/after.yaml"
diff -u "$TMP/before.yaml" "$TMP/after.yaml"
```

## Terraform

Run only if the directory is already initialized (`.terraform/` exists). Never run `terraform init` in the user's tree.

```sh
terraform plan -lock=false -input=false -out="$TMP/plan.bin"
terraform show -json "$TMP/plan.bin" > "$TMP/plan.json"
terraform graph > "$TMP/graph.dot"
```

Map `resource_changes[].change.actions`:

| actions | Style | Marker |
|---|---|---|
| `["create"]` | `added` | `+` |
| `["delete"]` | `removed` | `-` |
| `["update"]` | `changed` | `~` |
| `["delete","create"]` | `replace` | `-/+` |
| `["create","delete"]` | `replace` | `+/-` |
| `["no-op"]`, `["read"]` | boundary or omit | none |

Replace is never drawn as `changed`. Put the attribute that forces replacement on the node (from `change.replace_paths`).

## Fallback

If a tool is missing, not initialized, or fails (no credentials, no network), diff the source files instead and append ` (from diff only)` to the title of every diagram built that way.
