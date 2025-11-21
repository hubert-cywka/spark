export type IntegrationEventsModuleOptions<T> = T;

export type PublishAck = {
    ack: boolean;
};

export type IntegrationEventLabel = {
    topic: IntegrationEventTopic;
    subject: IntegrationEventSubject;
};

export type IntegrationEventTopic = "account" | "alert" | "2fa" | "configuration";
export type IntegrationEventSubject = `${IntegrationEventTopic}.${string}`;
