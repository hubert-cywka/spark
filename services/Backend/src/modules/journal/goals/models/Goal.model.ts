export type Goal = {
    id: string;
    authorId: string;
    name: string;
    target: number;
    targetProgress?: number;
    deadline: Date | null;
    createdAt: Date;
    updatedAt: Date;
};
