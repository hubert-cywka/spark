TODO

# Asynchronous communication

Communication between modules happens exclusively asynchronously. This allows for achieving full independence of 
modules, which can then be deployed as separate microservices. There's no need to list all the advantages of 
asynchronous communication, but its disadvantages are important:
- potential message loss,
- potential multiple message processing,
- processing messages in the wrong order.

---

## Delivery semantics

The implemented system guarantees "exactly once" message delivery:
- the outbox pattern ensures that the producer sends a given message at least once,
- the broker (Kafka) ensures that the consumer receives the message at least once,
- the inbox pattern ensures that the consumer processes a given message exactly once.

In summary, a message might reach the consumer multiple times, but the consumer won't process it more than once - 
the "exactly once" guarantee is ensured.

---

## Message ordering

There's no need to ensure full message ordering; it's sufficient to ensure that related messages are processed in the 
correct order. Therefore, partitions have been defined, to which messages are assigned based on a partition key. In 
many cases, this will be the data owner's identifier, but it could just as well be, for example, an order number. 
This allows for parallel message processing by multiple processes - this applies to processing both the outbox and 
inbox tables, as well as message delivery by Kafka.

Correct order is ensured for messages with the same partition's key:
- when writing to the outbox table, messages are assigned a sequential number,
- messages with the same partition's key are published in order, according to their sequential number,
- Kafka delivers messages in the same order it received them, within a given partition,
- when writing to the inbox table, messages are assigned a sequential number,
- messages with the same partition's key are processed in order, according to their sequential number.

The sequential number is assigned automatically by the database and is a 64-bit number. The counter would only roll 
over if over 2 billion messages were published from a single module for every person on earth, which isn't possible. 
However, it should be noted that the sequential number is assigned at the beginning of a transaction, which raises 
two issues:
- if the transaction fails, the number will never be used (the counter simply continues and skips the number),
- in the event of two parallel transactions, it's possible that a transaction that started later finishes earlier and 
  has a later sequential number.

Both of these problems can be ignored - lost sequence numbers don't block processing in any way, and if two messages 
are created with "wrong" sequence numbers due to parallel transactions, in most cases it will have no consequences 
because these messages will concern completely different resources. Other cases where resources are related are
handled in a way that doesn't force messages to be processed in a specific order.
