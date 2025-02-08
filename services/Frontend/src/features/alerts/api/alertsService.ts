import { AlertDto } from "@/features/alerts/api/dto/AlertDto";
import { ChangeAlertStatusDto } from "@/features/alerts/api/dto/ChangeAlertStatusDto";
import { ChangeAlertTimeDto } from "@/features/alerts/api/dto/ChangeAlertTimeDto";
import { CreateAlertDto } from "@/features/alerts/api/dto/CreateAlertDto";
import { Alert } from "@/features/alerts/types/Alert";
import { apiClient } from "@/lib/apiClient/apiClient";
import { convertLocalDataToUTC, convertUTCDataToLocal } from "@/utils/timeUtils";

export class AlertsService {
    public static async getAll() {
        const { data } = await apiClient.get<AlertDto[]>("/alert");
        return data.map(AlertsService.mapDtoToAlert);
    }

    public static async createOne(dto: CreateAlertDto) {
        const { data } = await apiClient.post<AlertDto>("/alert", convertLocalDataToUTC(dto));
        return AlertsService.mapDtoToAlert(data);
    }

    public static async deleteOne(id: string) {
        await apiClient.delete(`/alert/${id}`);
    }

    public static async updateStatus({ id, ...dto }: ChangeAlertStatusDto & { id: string }) {
        const { data } = await apiClient.patch<AlertDto>(`/alert/${id}/status`, dto);
        return AlertsService.mapDtoToAlert(data);
    }

    public static async updateTime({ id, ...dto }: ChangeAlertTimeDto & { id: string }) {
        const { data } = await apiClient.patch<AlertDto>(`/alert/${id}/time`, convertLocalDataToUTC(dto));
        return AlertsService.mapDtoToAlert(data);
    }

    private static mapDtoToAlert(dto: AlertDto): Alert {
        return {
            id: dto.id,
            createdAt: new Date(dto.createdAt),
            nextTriggerAt: new Date(dto.nextTriggerAt),
            enabled: dto.enabled,
            ...convertUTCDataToLocal({
                daysOfWeek: dto.daysOfWeek,
                time: dto.time,
            }),
        };
    }
}
