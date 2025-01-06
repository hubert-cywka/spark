import { PageDto } from "@/api/dto/PageDto";
import { CreateGoalRequestDto } from "@/features/goals/api/dto/CreateGoalRequestDto";
import { GoalDto } from "@/features/goals/api/dto/GoalDto";
import { UpdateGoalsDeadlineRequestDto } from "@/features/goals/api/dto/UpdateGoalsDeadlineRequestDto";
import { UpdateGoalsNameRequestDto } from "@/features/goals/api/dto/UpdateGoalsNameRequestDto";
import { Goal } from "@/features/goals/types/Goal";
import { apiClient } from "@/lib/apiClient/apiClient";

export class GoalsService {
    public static async getAll() {
        const { data } = await apiClient.get<PageDto<GoalDto>>("/goal");
        return { ...data, data: data.data.map(GoalsService.mapDtoToGoal) };
    }

    public static async getOne(id: string) {
        const { data } = await apiClient.get<GoalDto>(`/goal/${id}`);
        return GoalsService.mapDtoToGoal(data);
    }

    public static async createOne(dto: CreateGoalRequestDto) {
        const { data } = await apiClient.post("/goal", { body: dto });
        return GoalsService.mapDtoToGoal(data);
    }

    public static async updateName(id: string, dto: UpdateGoalsNameRequestDto) {
        const { data } = await apiClient.patch(`/goal${id}/name`, {
            body: dto,
        });
        return GoalsService.mapDtoToGoal(data);
    }

    public static async updateDeadline(id: string, dto: UpdateGoalsDeadlineRequestDto) {
        const { data } = await apiClient.patch(`/goal${id}/deadline`, {
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
            isAccomplished: dto.isAccomplished,
            deadline: dto.deadline ? new Date(dto.deadline) : null,
        };
    }
}
