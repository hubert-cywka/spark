export type JobScheduleUpdatedEventPayload<T extends object> = {
    id: string;
    callback: {
        topic: string;
        subject: string;
    };
} & T;
