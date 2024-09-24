export class PubSubEvent {
    public constructor(
        private topic: string,
        private payload: unknown
    ) {}

    public getTopic(): string {
        return this.topic;
    }

    public getPayload() {
        return this.payload;
    }
}
