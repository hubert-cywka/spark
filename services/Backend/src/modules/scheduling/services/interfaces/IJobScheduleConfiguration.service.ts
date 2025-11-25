import {JobCallback} from "@/modules/scheduling/models/JobCallback.model";

export const JobScheduleConfigurationServiceToken = Symbol("JobScheduleConfigurationService");

export interface IJobScheduleConfigurationService {
    upsert(id: string, interval: number, callback: JobCallback ): Promise<void>
}
