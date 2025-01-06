import { PageOptions } from "@/common/pagination/types/PageOptions";
import { Paginated } from "@/common/pagination/types/Paginated";
import { Goal } from "@/modules/journal/goals/models/Goal.model";

export const GoalServiceToken = Symbol("GoalService");

export interface IGoalService {
    findAll(authorId: string, pageOptions: PageOptions): Promise<Paginated<Goal>>;
    findOneById(authorId: string, goalId: string): Promise<Goal>;
    create(authorId: string, goal: Pick<Goal, "name" | "deadline">): Promise<Goal>;
    updateDeadline(authorId: string, goalId: string, deadline: Date | null): Promise<Goal>;
    updateName(authorId: string, goalId: string, name: string): Promise<Goal>;
    deleteById(authorId: string, goalId: string): Promise<void>;
}
