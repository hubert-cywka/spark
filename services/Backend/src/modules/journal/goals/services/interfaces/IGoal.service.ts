import { PageOptions } from "@/common/pagination/types/PageOptions";
import { Paginated } from "@/common/pagination/types/Paginated";
import { Goal } from "@/modules/journal/goals/models/Goal.model";
import { GoalFilters } from "@/modules/journal/goals/models/GoalFilters.model";

export const GoalServiceToken = Symbol("GoalService");

export interface IGoalService {
    findAll(authorId: string, pageOptions: PageOptions, filters?: GoalFilters): Promise<Paginated<Goal>>;
    findOneById(authorId: string, goalId: string): Promise<Goal>;
    create(authorId: string, goal: Pick<Goal, "name" | "deadline"> & { target: number }): Promise<Goal>;
    update(authorId: string, goalId: string, goal: Pick<Goal, "name" | "deadline"> & { target: number }): Promise<Goal>;
    deleteById(authorId: string, goalId: string): Promise<void>;
}
