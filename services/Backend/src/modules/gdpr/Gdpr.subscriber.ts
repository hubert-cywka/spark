import { Inject, Logger } from "@nestjs/common";

import { IInboxEventHandler, InboxEventHandlersToken } from "@/common/events";
import { BaseEventSubscriber } from "@/common/events/services/implementations/BaseEvent.subscriber";
import { type IEventInbox, EventInboxToken } from "@/common/events/services/interfaces/IEventInbox";

export class GdprSubscriber extends BaseEventSubscriber {
    public constructor(
        @Inject(EventInboxToken)
        inbox: IEventInbox,
        @Inject(InboxEventHandlersToken)
        handlers: IInboxEventHandler[]
    ) {
        super(inbox, handlers, new Logger(GdprSubscriber.name));
    }
}
