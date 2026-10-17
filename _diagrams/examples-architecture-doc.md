## Map

```mermaid
flowchart TD
  d1["Who uses the ticketing system?"]
  d1 -- Ticketing system --> d2["What is the ticketing system made of?"]
  d2 -- Booking API --> d3["How does a booking go?"]
  d2 -- Seat Service --> d4["What states can a seat be in?"]
```

## Who uses the ticketing system?

```mermaid
flowchart LR
  fan(["(1) Fan"]):::person
  staff(["(2) Venue staff"]):::person
  sys["(3) Ticketing system"]:::system
  pay["Payment provider"]:::boundary
  mail["Email service"]:::boundary
  fan -- "seat holds, ~300/s at peak<br/>payment" --> sys
  sys -- "events, seat maps" --> fan
  staff -- "events, seat maps<br/>~20 events/day" --> sys
  sys -- charge --> pay
  sys -- ticket --> mail
  mail -- ticket email --> fan

  classDef system fill:#ddf4ff,stroke:#0969da,stroke-width:3px,color:#1f2328
  classDef person fill:#ffffff,stroke:#57606a,stroke-width:2px,color:#1f2328
  classDef boundary fill:#eaeef2,stroke:#8c959f,stroke-dasharray:3 3,color:#57606a
```
1. [ticketing.md#L5](../examples/architecture-doc/ticketing.md?plain=1#L5)
2. [ticketing.md#L5](../examples/architecture-doc/ticketing.md?plain=1#L5)
3. [ticketing.md#L5](../examples/architecture-doc/ticketing.md?plain=1#L5)

## What is the ticketing system made of?

```mermaid
flowchart LR
  app["(1) Mobile app"]:::component
  console["(2) Admin console"]:::component
  booking["(3) Booking API"]:::component
  event["(4) Event API"]:::component
  seat["(5) Seat Service"]:::component
  padapter["(6) Payment Adapter"]:::component
  worker["(7) Notification Worker"]:::component
  redis[("(8) Redis<br/>holds, TTL 10 min")]:::component
  seatsdb[("(9) Seats DB")]:::component
  eventsdb[("(10) Events DB")]:::component
  queue[["(11) queue"]]:::component
  pay["Payment provider"]:::boundary
  mail["Email service"]:::boundary
  app -- "Booking API, HTTPS" --> booking
  console -- "Event API" --> event
  event --> eventsdb
  booking -- "hold, confirm, release" --> seat
  seat --> redis
  seat --> seatsdb
  booking -- charge --> padapter
  padapter -- "charge API" --> pay
  booking -- "ticket.purchased" --> queue
  queue --> worker
  worker -- "send ticket" --> mail

  classDef component fill:#ddf4ff,stroke:#0969da,stroke-width:2px,color:#1f2328
  classDef boundary fill:#eaeef2,stroke:#8c959f,stroke-dasharray:3 3,color:#57606a
```
1. [ticketing.md#L11](../examples/architecture-doc/ticketing.md?plain=1#L11)
2. [ticketing.md#L12](../examples/architecture-doc/ticketing.md?plain=1#L12)
3. [ticketing.md#L13](../examples/architecture-doc/ticketing.md?plain=1#L13)
4. [ticketing.md#L14](../examples/architecture-doc/ticketing.md?plain=1#L14)
5. [ticketing.md#L15](../examples/architecture-doc/ticketing.md?plain=1#L15)
6. [ticketing.md#L16](../examples/architecture-doc/ticketing.md?plain=1#L16)
7. [ticketing.md#L17](../examples/architecture-doc/ticketing.md?plain=1#L17)
8. [ticketing.md#L15](../examples/architecture-doc/ticketing.md?plain=1#L15)
9. [ticketing.md#L15](../examples/architecture-doc/ticketing.md?plain=1#L15)
10. [ticketing.md#L14](../examples/architecture-doc/ticketing.md?plain=1#L14)
11. [ticketing.md#L17](../examples/architecture-doc/ticketing.md?plain=1#L17)

## How does a booking go?

```mermaid
sequenceDiagram
  autonumber
  actor F as Fan
  participant B as Booking API
  participant S as Seat Service
  participant P as Payment Adapter
  participant Q as queue
  participant W as Notification Worker
  box rgba(140,149,159,0.15) External
    participant M as Email service
  end
  F->>B: pick seats
  B->>S: hold, 10 min
  alt a seat already held or sold
    S-->>B: hold failed
    B-->>F: seat map again
  else held
    F->>B: pay
    B->>P: charge
    alt charge succeeded
      B->>S: confirm seats
      B->>Q: ticket.purchased
      Q->>W: ticket.purchased
      W->>M: send ticket
    else charge failed
      B->>S: release hold
    end
  end
```
1. [ticketing.md#L21](../examples/architecture-doc/ticketing.md?plain=1#L21)
2. [ticketing.md#L21](../examples/architecture-doc/ticketing.md?plain=1#L21)
3. [ticketing.md#L22](../examples/architecture-doc/ticketing.md?plain=1#L22)
4. [ticketing.md#L22](../examples/architecture-doc/ticketing.md?plain=1#L22)
5. [ticketing.md#L23](../examples/architecture-doc/ticketing.md?plain=1#L23)
6. [ticketing.md#L23](../examples/architecture-doc/ticketing.md?plain=1#L23)
7. [ticketing.md#L24](../examples/architecture-doc/ticketing.md?plain=1#L24)
8. [ticketing.md#L24](../examples/architecture-doc/ticketing.md?plain=1#L24)
9. [ticketing.md#L26](../examples/architecture-doc/ticketing.md?plain=1#L26)
10. [ticketing.md#L26](../examples/architecture-doc/ticketing.md?plain=1#L26)
11. [ticketing.md#L25](../examples/architecture-doc/ticketing.md?plain=1#L25)

## What states can a seat be in?

```mermaid
stateDiagram-v2
  Available: (1) Available
  Held: (2) Held
  Sold: (3) Sold

  [*] --> Available
  Available --> Held: hold
  Held --> Sold: confirm after charge
  Held --> Available: release after failed charge
  Held --> Available: 10 min without confirm
```
1. [ticketing.md#L28](../examples/architecture-doc/ticketing.md?plain=1#L28)
2. [ticketing.md#L21](../examples/architecture-doc/ticketing.md?plain=1#L21)
3. [ticketing.md#L24](../examples/architecture-doc/ticketing.md?plain=1#L24)
