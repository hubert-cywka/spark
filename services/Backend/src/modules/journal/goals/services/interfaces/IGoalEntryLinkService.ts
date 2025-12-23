export const GoalEntryLinkServiceToken = Symbol("GoalEntryLinkServiceToken");

export interface IGoalEntryLinkService {
    createLink(authorId: string, goalId: string, entryId: string): Promise<void>;
    removeLink(authorId: string, goalId: string, entryId: string): Promise<void>;
}
