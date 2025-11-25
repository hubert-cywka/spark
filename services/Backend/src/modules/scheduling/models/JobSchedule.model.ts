import { JobCallback } from "@/modules/scheduling/models/JobCallback.model";

export type JobSchedule = {
    id: string;
    interval: number;
    callback: JobCallback
};
