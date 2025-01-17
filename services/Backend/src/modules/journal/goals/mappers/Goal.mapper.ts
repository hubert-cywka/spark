import { plainToClass } from "class-transformer";

import { BaseModelDTOEntityMapper } from "@/common/mappers/BaseModelDTOEntity.mapper";
import { GoalDto } from "@/modules/journal/goals/dto/Goal.dto";
import { PointsDto } from "@/modules/journal/goals/dto/Points.dto";
import { GoalEntity } from "@/modules/journal/goals/entities/Goal.entity";
import { IGoalMapper } from "@/modules/journal/goals/mappers/IGoal.mapper";
import { Goal } from "@/modules/journal/goals/models/Goal.model";

export class GoalMapper extends BaseModelDTOEntityMapper<Goal, GoalDto, GoalEntity> implements IGoalMapper {
    fromDtoToModel(dto: GoalDto): Goal {
        return {
            id: dto.id,
            authorId: dto.authorId,
            name: dto.name,
            points: dto.points,
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
            points: {
                target: entity.target,
                current: entity.entries.length,
            },
            isAccomplished: entity.entries.length >= entity.target,
            deadline: entity.deadline ? new Date(entity.deadline) : null,
            createdAt: new Date(entity.createdAt),
            updatedAt: new Date(entity.updatedAt),
        };
    }

    fromModelToDto(model: Goal): GoalDto {
        const pointsDto = plainToClass(PointsDto, {
            target: model.points.target,
            current: model.points.current,
        });

        return plainToClass(GoalDto, {
            id: model.id,
            authorId: model.authorId,
            name: model.name,
            points: pointsDto,
            isAccomplished: model.isAccomplished,
            deadline: model.deadline?.toISOString(),
            createdAt: model.createdAt.toISOString(),
            updatedAt: model.updatedAt.toISOString(),
        });
    }
}
