export type Goal = {
    id: string;
    authorId: string;
    name: string;
    target: number;
    deadline: Date | null;
    createdAt: Date;
    updatedAt: Date;
};
