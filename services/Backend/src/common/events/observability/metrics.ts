import { ValueType } from "@opentelemetry/api";

import { otelMeter } from "@/common/observability/metrics";

const outboxPublishLagHistogram = otelMeter.createHistogram("outbox_publish_lag_milliseconds", {
    description: "Lag between event creation in outbox and successful external publication",
    unit: "ms",
    valueType: ValueType.DOUBLE,
});

const outboxPartitionProcessDurationHistogram = otelMeter.createHistogram("outbox_partition_process_duration_milliseconds", {
    description: "Duration of the entire processing cycle for a single outbox partition",
    unit: "ms",
    valueType: ValueType.DOUBLE,
});

const outboxBatchSizeHistogram = otelMeter.createHistogram("outbox_batch_size", {
    description: "Number of events retrieved and published in a single batch operation",
    unit: "1",
    valueType: ValueType.INT,
});

const outboxPublishFailureCounter = otelMeter.createCounter("outbox_publish_failure_total", {
    description: "Total number of events that failed external publishing, stopping partition processing",
    unit: "1",
});

const inboxProcessDurationHistogram = otelMeter.createHistogram("inbox_process_duration_milliseconds", {
    description: "Duration of processing an inbound event (including persistence and business logic)",
    unit: "ms",
    valueType: ValueType.DOUBLE,
});

const inboxMessageProcessingLag = otelMeter.createHistogram("inbox_message_processing_lag_milliseconds", {
    description:
        "Duration between receiving the message from the queue and successfully completing its persistence and business logic processing",
    unit: "ms",
    valueType: ValueType.DOUBLE,
});

const inboxTransactionBatchSizeHistogram = otelMeter.createHistogram("inbox_transaction_batch_size", {
    description: "Number of events processed in a single inbox transaction",
    unit: "1",
    valueType: ValueType.INT,
});

const inboxProcessingFailureCounter = otelMeter.createCounter("inbox_processing_failure_total", {
    description: "Total number of inbound events that failed business logic processing (retries expected)",
    unit: "1",
});

const inboxProcessedEventsCounter = otelMeter.createCounter("inbox_processed_events_total", {
    description: "Total number of unique events successfully processed and persisted",
    unit: "1",
});

export const inboxMetrics = {
    processDuration: inboxProcessDurationHistogram,
    processingLag: inboxMessageProcessingLag,
    transactionBatchSize: inboxTransactionBatchSizeHistogram,
    processedEvents: inboxProcessedEventsCounter,
    processingFailure: inboxProcessingFailureCounter,
};

export const outboxMetrics = {
    publishLag: outboxPublishLagHistogram,
    partitionProcessDuration: outboxPartitionProcessDurationHistogram,
    batchSize: outboxBatchSizeHistogram,
    publishFailure: outboxPublishFailureCounter,
};
