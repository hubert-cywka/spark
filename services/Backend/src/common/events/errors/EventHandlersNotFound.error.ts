export class EventHandlersNotFoundError extends Error {
    constructor() {
        super("No handlers were found for this event.");
    }
}
