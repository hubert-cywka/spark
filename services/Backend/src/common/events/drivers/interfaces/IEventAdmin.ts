export const EventAdminToken = Symbol("EventAdminToken");

export interface IEventAdmin {
    purgeTopic(topic: string): Promise<void>;
}
