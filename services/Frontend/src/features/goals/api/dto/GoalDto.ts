export type GoalDto = {
    id: string;
    authorId: string;
    name: string;
    points: {
        target: number;
        current: number;
    };
    isAccomplished: boolean;
    deadline: string | null;
    createdAt: string;
    updatedAt: string;
};
