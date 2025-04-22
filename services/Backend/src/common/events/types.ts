export type IntegrationEventsModuleOptions<T> = T & {};

export type EventStream = {
    name: string;
    subjects: string[];
};

export type EventConsumer = {
    name: string;
    stream: string;
    subjects: string[];
};
