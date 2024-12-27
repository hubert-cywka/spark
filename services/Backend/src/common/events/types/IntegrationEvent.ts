export class IntegrationEvent {
    private readonly topic: string;
    private readonly payload: unknown;
    private readonly id: string;
    private readonly createdAt: Date;

    public constructor(topic: string, payload: unknown) {
        this.topic = topic;
        this.payload = payload;
        this.createdAt = new Date();
        this.id = crypto.randomUUID();
    }

    public getTopic(): string {
        return this.topic;
    }

    public getPayload(): unknown {
        return this.payload;
    }

    public getId(): string {
        return this.id;
    }

    public getCreatedAt(): Date {
        return this.createdAt;
    }
}
