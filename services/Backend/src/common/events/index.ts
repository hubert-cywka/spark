import { EventInbox } from "./services/implementations/EventInbox";
import { EventInboxToken, IEventInbox } from "./services/interfaces/IEventInbox";
import { EventPublisherToken, IEventPublisher } from "./services/interfaces/IEventPublisher";
import { type IInboxEventHandler, InboxEventHandlersToken } from "./services/interfaces/IInboxEventHandler";
import { IntegrationEvent } from "./types/IntegrationEvent";
import { IntegrationEvents } from "./types/IntegrationEvents";
import { IntegrationEventsModule } from "./IntegrationEvents.module";

import {EventPublisher} from "@/common/events/services/implementations/EventPublisher";

export { IntegrationEventsModule };
export {
    type IEventInbox,
    type IEventPublisher,
    type IInboxEventHandler,
    EventInbox,
    EventInboxToken,
    EventPublisher,
    EventPublisherToken,
    InboxEventHandlersToken,
    IntegrationEvent,
};
export { IntegrationEvents };
export * from "./types/2fa/EmailIntegrationTOTPIssuedEvent";
export * from "./types/account/AccountActivatedEvent";
export * from "./types/account/AccountActivationTokenRequestedEvent";
export * from "./types/account/AccountCreatedEvent";
export * from "./types/account/AccountPasswordUpdatedEvent";
export * from "./types/account/AccountRemovalCompletedEvent";
export * from "./types/account/AccountRemovalRequestedEvent";
export * from "./types/account/AccountRequestedPasswordResetEvent";
export * from "./types/account/AccountSuspendedEvent";
export * from "./types/alert/DailyReminderTriggeredEvent";
export * from "./types/scheduling/IntervalJobScheduleUpdatedEvent";
