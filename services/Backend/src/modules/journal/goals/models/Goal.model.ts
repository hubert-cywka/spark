export type Goal = {
    id: string;
    authorId: string;
    name: string;
    isAccomplished: boolean;
    deadline: Date | null;
    createdAt: Date;
    updatedAt: Date;
};
