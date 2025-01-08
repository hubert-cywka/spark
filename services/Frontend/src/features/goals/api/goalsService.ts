import { PageDto } from "@/api/dto/PageDto";
import { CreateOrUpdateGoalRequestDto } from "@/features/goals/api/dto/CreateOrUpdateGoalRequestDto";
import { GoalDto } from "@/features/goals/api/dto/GoalDto";
import { Goal } from "@/features/goals/types/Goal";
import { apiClient } from "@/lib/apiClient/apiClient";

export class GoalsService {
    public static async getPage(page: number) {
        const { data } = await apiClient.get<PageDto<GoalDto>>(`/goal?page=${page}`);
        return { ...data, data: data.data.map(GoalsService.mapDtoToGoal) };
    }

    public static async getOne(id: string) {
        const { data } = await apiClient.get<GoalDto>(`/goal/${id}`);
        return GoalsService.mapDtoToGoal(data);
    }

    public static async createOne(dto: CreateOrUpdateGoalRequestDto) {
        const { data } = await apiClient.post("/goal", { body: dto });
        return GoalsService.mapDtoToGoal(data);
    }

    public static async updateOne({ id, ...dto }: CreateOrUpdateGoalRequestDto & { id: string }) {
        const { data } = await apiClient.put(`/goal${id}`, {
            body: dto,
        });
        return GoalsService.mapDtoToGoal(data);
    }

    public static async deleteOne(id: string) {
        await apiClient.delete(`/goal/${id}`);
    }

    private static mapDtoToGoal(dto: GoalDto): Goal {
        return {
            id: dto.id,
            name: dto.name,
            createdAt: new Date(dto.createdAt),
            points: dto.points,
            isAccomplished: dto.isAccomplished,
            deadline: dto.deadline ? new Date(dto.deadline) : null,
        };
    }
}
