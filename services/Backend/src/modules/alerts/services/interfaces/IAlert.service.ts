import { Weekday } from "@/modules/alerts/enums/Weekday.enum";
import { Alert } from "@/modules/alerts/models/Alert.model";

export const AlertServiceToken = Symbol("AlertServiceToken");

export interface IAlertService {
    getAll(recipientId: string): Promise<Alert[]>;
    create(recipientId: string, time: string, daysOfWeek: Weekday[]): Promise<Alert>;
    delete(recipientId: string, alertId: string): Promise<void>;

    changeStatus(recipientId: string, alertId: string, enabled: boolean): Promise<Alert>;
    changeTime(recipientId: string, alertId: string, alertTime: string, daysOfWeek: Weekday[]): Promise<Alert>;
}
