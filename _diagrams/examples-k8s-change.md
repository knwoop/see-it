## Legend

```mermaid
flowchart TB
  added["+ added"]:::added
  changed["~ changed"]:::changed
  boundary["outside scope"]:::boundary

  classDef added fill:#dafbe1,stroke:#1a7f37,stroke-width:2px,color:#1f2328
  classDef changed fill:#fff8c5,stroke:#9a6700,stroke-width:2px,color:#1f2328
  classDef boundary fill:#eaeef2,stroke:#8c959f,stroke-dasharray:3 3,color:#57606a
```

## What changes in namespace shop?

```mermaid
flowchart LR
  client((client)):::boundary
  subgraph ns["namespace: shop"]
    ing["(1) Ingress/shop<br/>shop.example.com /"] --> svc["(2) Service/web<br/>80 → 8080"]
    svc --> dep["(3) ~ Deployment/web<br/>replicas: 2 → 4<br/>image: web:1.4.0 → 1.5.0<br/>cpu request: 100m → 250m<br/>maxUnavailable: 1 → 0<br/>+ readinessProbe /healthz"]:::changed
    hpa["(4) + HPA/web<br/>replicas 4..10<br/>cpu target 70%"]:::added -- scales --> dep
  end
  client --> ing

  classDef added fill:#dafbe1,stroke:#1a7f37,stroke-width:2px,color:#1f2328
  classDef removed fill:#ffebe9,stroke:#cf222e,stroke-width:2px,stroke-dasharray:5 3,color:#1f2328
  classDef changed fill:#fff8c5,stroke:#9a6700,stroke-width:2px,color:#1f2328
  classDef boundary fill:#eaeef2,stroke:#8c959f,stroke-dasharray:3 3,color:#57606a
```
1. [examples/k8s-change/after/web.yaml#L49-L65](../examples/k8s-change/after/web.yaml#L49-L65)
2. [examples/k8s-change/after/web.yaml#L37-L47](../examples/k8s-change/after/web.yaml#L37-L47)
3. [examples/k8s-change/after/web.yaml#L1-L35](../examples/k8s-change/after/web.yaml#L1-L35)
4. [examples/k8s-change/after/web.yaml#L67-L85](../examples/k8s-change/after/web.yaml#L67-L85)

## How does a rollout of Deployment/web proceed?

```mermaid
sequenceDiagram
  autonumber
  participant D as Deployment/web
  participant N as new Pod web:1.5.0
  participant S as Service/web
  participant O as old Pod web:1.4.0
  loop until 4 new Pods ready
    D->>N: create 1, maxSurge 1
    N->>N: readinessProbe /healthz, every 5s
    N-->>S: ready, added to endpoints
    D->>O: terminate 1, maxUnavailable 0
    O-->>S: removed from endpoints
  end
```
1. [examples/k8s-change/after/web.yaml#L11](../examples/k8s-change/after/web.yaml#L11)
2. [examples/k8s-change/after/web.yaml#L26-L31](../examples/k8s-change/after/web.yaml#L26-L31)
3. [examples/k8s-change/after/web.yaml#L43-L44](../examples/k8s-change/after/web.yaml#L43-L44)
4. [examples/k8s-change/after/web.yaml#L12](../examples/k8s-change/after/web.yaml#L12)
5. [examples/k8s-change/after/web.yaml#L43-L44](../examples/k8s-change/after/web.yaml#L43-L44)

## When does HPA/web scale?

```mermaid
flowchart TD
  util["(1) avg CPU ÷ request 250m"] --> desired["(2) ceil(replicas × util ÷ 70%)"]
  desired --> clamp{"(3) within 4..10?"}
  clamp -- yes --> set["(4) Deployment/web replicas"]
  clamp -- no --> bound["(5) clamp to 4 or 10"]
  bound --> set
```
1. [examples/k8s-change/after/web.yaml#L34](../examples/k8s-change/after/web.yaml#L34)
2. [examples/k8s-change/after/web.yaml#L85](../examples/k8s-change/after/web.yaml#L85)
3. [examples/k8s-change/after/web.yaml#L77-L78](../examples/k8s-change/after/web.yaml#L77-L78)
4. [examples/k8s-change/after/web.yaml#L73-L76](../examples/k8s-change/after/web.yaml#L73-L76)
5. [examples/k8s-change/after/web.yaml#L77-L78](../examples/k8s-change/after/web.yaml#L77-L78)
