## How does a job move between states?

```mermaid
stateDiagram-v2
  [*] --> Queued
  Queued: (1) Queued
  Running: (2) Running
  Rejected: (3) Rejected
  Succeeded: (4) Succeeded
  Backoff: (5) Backoff
  Failed: (6) Failed
  Cancelled: (7) Cancelled
  state attemptsLeft <<choice>>

  Queued --> Running: worker slot free
  Queued --> Rejected: quota exceeded
  Running --> Succeeded: success
  Running --> attemptsLeft: failure or no heartbeat 60s
  attemptsLeft --> Backoff: attempts < maxAttempts
  attemptsLeft --> Failed: no attempts left
  Backoff --> Queued: 2^attempts s, max 5m
  Queued --> Cancelled: cancel
  Running --> Cancelled: cancel, SIGTERM, max 30s
  Backoff --> Cancelled: cancel

  Rejected --> [*]
  Succeeded --> [*]
  Failed --> [*]
  Cancelled --> [*]
```
1. [examples/doc-excerpt/job-lifecycle.md#L5](../examples/doc-excerpt/job-lifecycle.md#L5)
2. [examples/doc-excerpt/job-lifecycle.md#L5-L9](../examples/doc-excerpt/job-lifecycle.md#L5-L9)
3. [examples/doc-excerpt/job-lifecycle.md#L6-L7](../examples/doc-excerpt/job-lifecycle.md#L6-L7)
4. [examples/doc-excerpt/job-lifecycle.md#L11](../examples/doc-excerpt/job-lifecycle.md#L11)
5. [examples/doc-excerpt/job-lifecycle.md#L12-L17](../examples/doc-excerpt/job-lifecycle.md#L12-L17)
6. [examples/doc-excerpt/job-lifecycle.md#L12-L14](../examples/doc-excerpt/job-lifecycle.md#L12-L14)
7. [examples/doc-excerpt/job-lifecycle.md#L19-L21](../examples/doc-excerpt/job-lifecycle.md#L19-L21)
