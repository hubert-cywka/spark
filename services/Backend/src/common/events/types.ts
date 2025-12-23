export type IntegrationEventsModuleOptions<T> = T;

export type PublishAck = {
    ack: boolean;
};

export type IntegrationEventLabel = {
    topic: IntegrationEventTopic;
    subject: IntegrationEventSubject;
};

export type IntegrationEventTopic = "account" | "alert" | "2fa" | "scheduling" | "refresh_token" | "privacy";
export type IntegrationEventSubject = `${IntegrationEventTopic}.${string}`;
