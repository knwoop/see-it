## Legend

```mermaid
flowchart TB
  added["+ added"]:::added
  removed["- removed"]:::removed
  changed["~ changed"]:::changed

  classDef added fill:#dafbe1,stroke:#1a7f37,stroke-width:2px,color:#1f2328
  classDef removed fill:#ffebe9,stroke:#cf222e,stroke-width:2px,stroke-dasharray:5 3,color:#1f2328
  classDef changed fill:#fff8c5,stroke:#9a6700,stroke-width:2px,color:#1f2328
```

## What changes in fetch.Get?

```mermaid
flowchart TD
  call(["(1) ~ Get(ctx, c, url)"]):::changed --> loop{"(2) ~ attempt < maxAttempts<br/>3 → 5"}:::changed
  loop -- yes --> req["(3) + NewRequestWithContext"]:::added
  req -- err --> reqErr(["(4) + return err"]):::added
  req --> send["(5) ~ c.Get → c.Do"]:::changed
  send --> ok{"(6) ~ err == nil<br/>+ status < 500"}:::changed
  ok -- yes --> ret(["(7) return resp"])
  ok -- no --> close["(8) + close body"]:::added
  close --> wait{"(9) + ctx done or backoff"}:::added
  wait -- ctx done --> ctxErr(["(10) + return ctx.Err()"]):::added
  wait -- backoff --> grow["(11) + backoff ×2<br/>from 100ms"]:::added
  grow --> loop
  loop -- no --> exhausted(["(12) ~ return ErrRetriesExhausted"]):::changed
  ok -. no .-> sleep["(13) - sleep 1s"]:::removed
  sleep -.-> loop
  linkStyle 12,13 stroke:#cf222e

  classDef added fill:#dafbe1,stroke:#1a7f37,stroke-width:2px,color:#1f2328
  classDef removed fill:#ffebe9,stroke:#cf222e,stroke-width:2px,stroke-dasharray:5 3,color:#1f2328
  classDef changed fill:#fff8c5,stroke:#9a6700,stroke-width:2px,color:#1f2328
```
1. [examples/code-change/after/retry.go#L15](../examples/code-change/after/retry.go#L15)
2. [examples/code-change/after/retry.go#L17](../examples/code-change/after/retry.go#L17)
3. [examples/code-change/after/retry.go#L18](../examples/code-change/after/retry.go#L18)
4. [examples/code-change/after/retry.go#L19-L21](../examples/code-change/after/retry.go#L19-L21)
5. [examples/code-change/after/retry.go#L22](../examples/code-change/after/retry.go#L22)
6. [examples/code-change/after/retry.go#L23](../examples/code-change/after/retry.go#L23)
7. [examples/code-change/after/retry.go#L24](../examples/code-change/after/retry.go#L24)
8. [examples/code-change/after/retry.go#L26-L28](../examples/code-change/after/retry.go#L26-L28)
9. [examples/code-change/after/retry.go#L29-L33](../examples/code-change/after/retry.go#L29-L33)
10. [examples/code-change/after/retry.go#L30-L31](../examples/code-change/after/retry.go#L30-L31)
11. [examples/code-change/after/retry.go#L34](../examples/code-change/after/retry.go#L34)
12. [examples/code-change/after/retry.go#L36](../examples/code-change/after/retry.go#L36)
13. [examples/code-change/before/retry.go#L19](../examples/code-change/before/retry.go#L19)

## How does Get retry before?

```mermaid
flowchart TD
  call(["(1) Get(c, url)"]) --> loop{"(2) attempt < 3"}
  loop -- yes --> send["(3) c.Get"]
  send --> ok{"(4) err == nil"}
  ok -- yes --> ret(["(5) return resp"])
  ok -- no --> sleep["(6) sleep 1s"]
  sleep --> loop
  loop -- no --> exhausted(["(7) return lastErr"])
```
1. [examples/code-change/before/retry.go#L11](../examples/code-change/before/retry.go#L11)
2. [examples/code-change/before/retry.go#L13](../examples/code-change/before/retry.go#L13)
3. [examples/code-change/before/retry.go#L14](../examples/code-change/before/retry.go#L14)
4. [examples/code-change/before/retry.go#L15](../examples/code-change/before/retry.go#L15)
5. [examples/code-change/before/retry.go#L16](../examples/code-change/before/retry.go#L16)
6. [examples/code-change/before/retry.go#L19](../examples/code-change/before/retry.go#L19)
7. [examples/code-change/before/retry.go#L21](../examples/code-change/before/retry.go#L21)

## How does Get retry after?

```mermaid
flowchart TD
  call(["(1) Get(ctx, c, url)"]) --> loop{"(2) attempt < 5"}
  loop -- yes --> req["(3) NewRequestWithContext"]
  req -- err --> reqErr(["(4) return err"])
  req --> send["(5) c.Do"]
  send --> ok{"(6) err == nil<br/>and status < 500"}
  ok -- yes --> ret(["(7) return resp"])
  ok -- no --> close["(8) close body"]
  close --> wait{"(9) ctx done or backoff"}
  wait -- ctx done --> ctxErr(["(10) return ctx.Err()"])
  wait -- backoff --> grow["(11) backoff ×2<br/>from 100ms"]
  grow --> loop
  loop -- no --> exhausted(["(12) return ErrRetriesExhausted"])
```
1. [examples/code-change/after/retry.go#L15](../examples/code-change/after/retry.go#L15)
2. [examples/code-change/after/retry.go#L17](../examples/code-change/after/retry.go#L17)
3. [examples/code-change/after/retry.go#L18](../examples/code-change/after/retry.go#L18)
4. [examples/code-change/after/retry.go#L19-L21](../examples/code-change/after/retry.go#L19-L21)
5. [examples/code-change/after/retry.go#L22](../examples/code-change/after/retry.go#L22)
6. [examples/code-change/after/retry.go#L23](../examples/code-change/after/retry.go#L23)
7. [examples/code-change/after/retry.go#L24](../examples/code-change/after/retry.go#L24)
8. [examples/code-change/after/retry.go#L26-L28](../examples/code-change/after/retry.go#L26-L28)
9. [examples/code-change/after/retry.go#L29-L33](../examples/code-change/after/retry.go#L29-L33)
10. [examples/code-change/after/retry.go#L30-L31](../examples/code-change/after/retry.go#L30-L31)
11. [examples/code-change/after/retry.go#L34](../examples/code-change/after/retry.go#L34)
12. [examples/code-change/after/retry.go#L36](../examples/code-change/after/retry.go#L36)
