import { ValueType } from "@opentelemetry/api";

import { otelMeter } from "@/common/observability/metrics";

const kafkaPublishedMessagesCounter = otelMeter.createCounter("kafka_published_messages", {
    description: "Number of messages published to Kafka",
    unit: "1",
    valueType: ValueType.INT,
});

const kafkaReceivedMessagesCounter = otelMeter.createCounter("kafka_received_messages", {
    description: "Number of messages received from Kafka",
    unit: "1",
    valueType: ValueType.INT,
});

const kafkaConsumedMessagesCounter = otelMeter.createCounter("kafka_consumed_messages", {
    description: "Number of messages received and consumed from Kafka",
    unit: "1",
    valueType: ValueType.INT,
});

const kafkaBatchConsumingDurationHistogram = otelMeter.createHistogram("kafka_batch_consuming_duration_milliseconds", {
    description: "Duration of consuming a single batch of Kafka messages",
    unit: "ms",
    valueType: ValueType.DOUBLE,
});

const kafkaBatchSizeHistogram = otelMeter.createHistogram("kafka_batch_size", {
    description: "The number of Kafka messages in each processed batch",
    unit: "1",
    valueType: ValueType.INT,
});

export const kafkaMetrics = {
    batchSize: kafkaBatchSizeHistogram,
    batchConsumingDuration: kafkaBatchConsumingDurationHistogram,
    consumedMessages: kafkaConsumedMessagesCounter,
    receivedMessages: kafkaReceivedMessagesCounter,
    publishedMessages: kafkaPublishedMessagesCounter,
};
