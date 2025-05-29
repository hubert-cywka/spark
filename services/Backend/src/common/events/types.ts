export type IntegrationEventsModuleOptions<T> = T;

export type IntegrationEventsStream = {
    name: string;
    subjects: string[];
};

export type PublishAck = {
    ack: boolean;
};
