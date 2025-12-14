import { ValueType } from "@opentelemetry/api";

import { otelMeter } from "@/common/observability/metrics";

export const kafkaPublishedMessagesCounter = otelMeter.createCounter("kafka_published_messages", {
    description: "Number of messages published to Kafka",
    unit: "1",
    valueType: ValueType.INT,
});

export const kafkaReceivedMessagesCounter = otelMeter.createCounter("kafka_received_messages", {
    description: "Number of messages received from Kafka",
    unit: "1",
    valueType: ValueType.INT,
});

export const kafkaConsumedMessagesCounter = otelMeter.createCounter("kafka_consumed_messages", {
    description: "Number of messages received and consumed from Kafka",
    unit: "1",
    valueType: ValueType.INT,
});

export const kafkaProcessingDurationHistogram = otelMeter.createHistogram("kafka_process_duration_milliseconds", {
    description: "Duration of processing a single batch of Kafka messages",
    unit: "ms",
    valueType: ValueType.DOUBLE,
});

export const kafkaProcessingErrorsCounter = otelMeter.createCounter("kafka_processing_errors_total", {
    description: "Total number of Kafka messages that resulted in a processing error",
});

export const kafkaBatchSizeHistogram = otelMeter.createHistogram("kafka_batch_size", {
    description: "The number of messages in each processed batch",
    unit: "1",
    valueType: ValueType.INT,
});
