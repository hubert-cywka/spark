import { plainToClass } from "class-transformer";

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
            isAccomplished: dto.isAccomplished,
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
            isAccomplished: entity.isAccomplished,
            deadline: entity.deadline ? new Date(entity.deadline) : null,
            createdAt: new Date(entity.createdAt),
            updatedAt: new Date(entity.updatedAt),
        };
    }

    fromModelToDto(model: Goal): GoalDto {
        return plainToClass(GoalDto, {
            id: model.id,
            authorId: model.authorId,
            name: model.name,
            isAccomplished: model.isAccomplished,
            deadline: model.deadline?.toISOString(),
            createdAt: model.createdAt.toISOString(),
            updatedAt: model.updatedAt.toISOString(),
        });
    }
}
