# Batch Job Lifecycle (design doc excerpt)

## Job states

A job is created in `Queued`. The scheduler moves it to `Running` once a worker
slot is free. A job that exceeds its quota while queued is moved to `Rejected`
and never runs.

While `Running`, a job finishes in one of three ways:

- The worker reports success and the job becomes `Succeeded`.
- The worker reports a failure. If the job has attempts left (`attempts < maxAttempts`),
  it goes to `Backoff`; otherwise it becomes `Failed`.
- The worker stops sending heartbeats for 60 seconds. This is treated the same as a failure.

From `Backoff`, the job returns to `Queued` after the backoff delay
(`2^attempts` seconds, capped at 5 minutes).

A user can cancel a job in `Queued`, `Running`, or `Backoff`. Cancelling a
running job sends SIGTERM to the worker and waits up to 30 seconds before the
job becomes `Cancelled`.

`Succeeded`, `Failed`, `Rejected`, and `Cancelled` are terminal.
