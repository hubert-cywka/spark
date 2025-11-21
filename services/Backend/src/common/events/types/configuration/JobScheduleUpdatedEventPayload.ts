export type JobScheduleUpdatedEventPayload<T extends object> = {
    jobId: string;
    callback: {
        topic: string;
        subject: string;
    }
} & T;