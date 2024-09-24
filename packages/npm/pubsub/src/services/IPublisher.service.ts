import { PubSubEvent } from "../channels/PubSubEvent";

export const IPublisherServiceToken = Symbol("IPublisherServiceToken");

export interface IPublisherService {
    publish(event: PubSubEvent): void;
}
