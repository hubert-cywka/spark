export type GoalDto = {
    id: string;
    authorId: string;
    name: string;
    isAccomplished: boolean;
    deadline: string | null;
    createdAt: string;
    updatedAt: string;
};
