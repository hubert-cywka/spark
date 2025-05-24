import { TransactionHost } from "@nestjs-cls/transactional";
import { TransactionalAdapterTypeOrm } from "@nestjs-cls/transactional-adapter-typeorm";

export const EventInboxOptionsToken = Symbol("EventInboxOptions");

export interface IEventInboxOptions {
    txHost: TransactionHost<TransactionalAdapterTypeOrm>;
    context: string;
}
