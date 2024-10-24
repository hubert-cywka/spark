import { PubSubEvent } from "../topics/PubSubEvent";

export const IPublisherServiceToken = Symbol("IPublisherServiceToken");

export interface IPublisherService {
    publish(event: PubSubEvent): void;
}
