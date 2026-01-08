export type GoalDto = {
    id: string;
    authorId: string;
    name: string;
    target: number;
    targetProgress?: number;
    deadline: string | null;
    createdAt: string;
    updatedAt: string;
};
