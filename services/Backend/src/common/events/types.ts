export type IntegrationEventsModuleOptions<T> = T;

export type PublishAck = {
    ack: boolean;
};

export type IntegrationEventLabel = {
    topic: IntegrationEventTopic;
    subject: IntegrationEventSubject;
};

export type IntegrationEventTopic = "account" | "alert" | "2fa" | "scheduling";
export type IntegrationEventSubject = `${IntegrationEventTopic}.${string}`;
