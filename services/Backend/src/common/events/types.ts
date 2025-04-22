export type IntegrationEventsModuleOptions<T> = T & {};

export type IntegrationEventsStream = {
    name: string;
    subjects: string[];
};

export type IntegrationEventsConsumer = {
    name: string;
    stream: string;
    subjects: string[];
};
