import { type IInboxEventHandler } from "@/common/events/services/interfaces/IInboxEventHandler";

export type IntegrationEventsModuleOptions<T> = T & {};
export type IntegrationEventsForFeatureOptions = {
    handlers: IInboxEventHandler[];
};

export type EventStream = {
    name: string;
    subjects: string[];
};

export type EventConsumer = {
    name: string;
    stream: string;
    subjects: string[];
};
