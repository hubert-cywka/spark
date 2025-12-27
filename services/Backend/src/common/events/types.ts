export type IntegrationEventsModuleOptions<T> = T;

export type PublishAck = {
    ack: boolean;
};

export type IntegrationEventLabel = {
    topic: IntegrationEventTopic;
    subject: IntegrationEventSubject;
};

export type IntegrationEventTopic = "account" | "alert" | "2fa" | "scheduling" | "refresh_token" | "purge" | "export";
export type IntegrationEventSubject = `${IntegrationEventTopic}.${string}`;
