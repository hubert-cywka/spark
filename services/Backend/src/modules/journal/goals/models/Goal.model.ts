export type Goal = {
    id: string;
    authorId: string;
    name: string;
    points: {
        target: number;
        current: number;
    };
    isAccomplished: boolean;
    deadline: Date | null;
    createdAt: Date;
    updatedAt: Date;
};
