# Sending events from the outbox

## Context
In this project, asynchronous communication is currently the only method of communication between independent modules.
Eventual consistency is accepted for all current use cases and has been achieved by incorporating the transactional outbox pattern.
However, in a few scenarios, events sent to other modules are valid only for a limited time. The current implementation of the transactional outbox pattern
relies on frequent polling. While this reduces additional latency to approximately 1 second, over 99% of the time there are no events to process, making the polling redundant.

## Decision
It has been decided that events requiring "at-least-once" delivery will now be processed immediately after being enqueued. Polling will remain in place to process
any events that could not be delivered, but the polling interval will be increased to 10-60 seconds.

### Reasons
1. **Retries are usually not required:** In 99.9% of cases, the event is published successfully on the first attempt. Publishing failures typically only occur due to broker or network malfunctions.
2. **Polling shouldn't be the sole way of processing events:** When a broker or network malfunction occurs, a short polling interval can exacerbate the problem. Using a longer interval gives the broker or network time to recover but increases latency.

## Consequences
- Each retry will be delayed further than before, increasing latency in the rare cases where immediate publishing fails.

## Alternatives considered
1. **Using CDC (Change Data Capture):**
   - **Rejected**, as this introduces coupling at the infrastructure level. It may also introduce problems with scaling (e.g., determining which replica is responsible for listening to changes and publishing events).

## Date
Decision date: `2025.05.24`

## Authors
Decision authors: Hubert Cywka
