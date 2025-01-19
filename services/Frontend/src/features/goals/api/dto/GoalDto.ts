export type GoalDto = {
    id: string;
    authorId: string;
    name: string;
    target: number;
    targetProgress?: number;
    isTargetMet?: boolean;
    deadline: string | null;
    createdAt: string;
    updatedAt: string;
};
