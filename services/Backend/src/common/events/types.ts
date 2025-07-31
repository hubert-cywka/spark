export type IntegrationEventsModuleOptions<T> = T;

export type PublishAck = {
    ack: boolean;
};

export type IntegrationEventLabel = {
    topic: IntegrationEventTopic;
    subject: string;
};

export type IntegrationEventTopic = "account" | "alert" | "2fa";
