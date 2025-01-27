export class EmailDeliveryError extends Error {
    constructor(reason: string) {
        super(reason);
    }
}
