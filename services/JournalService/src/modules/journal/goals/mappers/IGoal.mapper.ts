import { IModelDTOEntityMapper } from "@/common/mappers/IModelDTOEntity.mapper";
import { GoalDto } from "@/modules/journal/goals/dto/Goal.dto";
import { GoalEntity } from "@/modules/journal/goals/entities/Goal.entity";
import { Goal } from "@/modules/journal/goals/models/Goal.model";

export const GoalMapperToken = Symbol("GoalMapper");

export interface IGoalMapper extends IModelDTOEntityMapper<Goal, GoalDto, GoalEntity> {}
