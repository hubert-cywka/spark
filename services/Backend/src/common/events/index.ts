import { EventInbox } from "./services/implementations/EventInbox";
import { EventOutbox } from "./services/implementations/EventOutbox";
import { EventBoxFactoryToken, IEventBoxFactory } from "./services/interfaces/IEventBox.factory";
import { EventInboxToken, IEventInbox } from "./services/interfaces/IEventInbox";
import { EventOutboxToken, IEventOutbox } from "./services/interfaces/IEventOutbox";
import { type IInboxEventHandler, InboxEventHandlersToken } from "./services/interfaces/IInboxEventHandler";
import { IntegrationEvent } from "./types/IntegrationEvent";
import { IntegrationEventStreams } from "./types/IntegrationEventStreams";
import { IntegrationEventTopics } from "./types/IntegrationEventTopics";
import { IntegrationEventsModule } from "./IntegrationEvents.module";

export { IntegrationEventsModule };
export {
    type IEventBoxFactory,
    type IEventInbox,
    type IEventOutbox,
    type IInboxEventHandler,
    EventBoxFactoryToken,
    EventInbox,
    EventInboxToken,
    EventOutbox,
    EventOutboxToken,
    InboxEventHandlersToken,
    IntegrationEvent,
};
export { IntegrationEventStreams, IntegrationEventTopics };
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
