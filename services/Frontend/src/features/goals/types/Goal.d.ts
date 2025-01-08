export type Goal = {
    id: string;
    name: string;
    isAccomplished: boolean;
    points: {
        current: number;
        target: number;
    };
    deadline: Date | null;
    createdAt: Date;
};
