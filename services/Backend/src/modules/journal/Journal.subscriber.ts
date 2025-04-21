import { Inject, Logger } from "@nestjs/common";

import { type IEventInbox, EventInboxToken, IInboxEventHandler, InboxEventHandlersToken } from "@/common/events";
import { BaseEventSubscriber } from "@/common/events/services/implementations/BaseEvent.subscriber";

export class JournalSubscriber extends BaseEventSubscriber {
    public constructor(@Inject(EventInboxToken) inbox: IEventInbox, @Inject(InboxEventHandlersToken) handlers: IInboxEventHandler[]) {
        super(inbox, handlers, new Logger(JournalSubscriber.name));
    }
}
