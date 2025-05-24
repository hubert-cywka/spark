import { TransactionHost } from "@nestjs-cls/transactional";
import { TransactionalAdapterTypeOrm } from "@nestjs-cls/transactional-adapter-typeorm";

export const EventOutboxOptionsToken = Symbol("EventOutboxOptions");

export interface IEventOutboxOptions {
    txHost: TransactionHost<TransactionalAdapterTypeOrm>;
    context: string;
}
