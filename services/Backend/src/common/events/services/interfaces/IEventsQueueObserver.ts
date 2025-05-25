import { IEventsQueueSubscriber } from "@/common/events/services/interfaces/IEventsQueueSubscriber";

export interface IEventsQueueObserver {
    subscribe(subscriber: IEventsQueueSubscriber): void;
}
