import { type IOutbox } from "@/common/events/services/IOutbox";

export const OutboxFactoryToken = Symbol("OutboxFactory");

export interface OutboxFactory {
    create(context?: string): IOutbox;
}
