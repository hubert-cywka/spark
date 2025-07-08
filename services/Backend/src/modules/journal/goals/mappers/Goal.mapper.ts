import { plainToInstance } from "class-transformer";

import { BaseModelDTOEntityMapper } from "@/common/mappers/BaseModelDTOEntity.mapper";
import { GoalDto } from "@/modules/journal/goals/dto/Goal.dto";
import { GoalEntity } from "@/modules/journal/goals/entities/Goal.entity";
import { IGoalMapper } from "@/modules/journal/goals/mappers/IGoal.mapper";
import { Goal } from "@/modules/journal/goals/models/Goal.model";

export class GoalMapper extends BaseModelDTOEntityMapper<Goal, GoalDto, GoalEntity> implements IGoalMapper {
    fromDtoToModel(dto: GoalDto): Goal {
        return {
            id: dto.id,
            authorId: dto.authorId,
            name: dto.name,
            target: dto.target,
            targetProgress: dto.targetProgress,
            isTargetMet: dto.isTargetMet,
            deadline: dto.deadline ? new Date(dto.deadline) : null,
            createdAt: new Date(dto.createdAt),
            updatedAt: new Date(dto.updatedAt),
        };
    }

    fromEntityToModel(entity: GoalEntity): Goal {
        return {
            id: entity.id,
            authorId: entity.authorId,
            name: entity.name,
            target: entity.target,
            targetProgress: entity.entries?.length,
            isTargetMet: entity.entries ? entity.entries.length >= entity.target : undefined,
            deadline: entity.deadline ? new Date(entity.deadline) : null,
            createdAt: new Date(entity.createdAt),
            updatedAt: new Date(entity.updatedAt),
        };
    }

    fromModelToDto(model: Goal): GoalDto {
        return plainToInstance(GoalDto, {
            id: model.id,
            authorId: model.authorId,
            name: model.name,
            target: model.target,
            targetProgress: model.targetProgress,
            isTargetMet: model.isTargetMet,
            deadline: model.deadline?.toISOString(),
            createdAt: model.createdAt.toISOString(),
            updatedAt: model.updatedAt.toISOString(),
        });
    }
}
