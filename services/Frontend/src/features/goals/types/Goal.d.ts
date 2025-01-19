export type Goal = {
    id: string;
    name: string;
    target: number;
    targetProgress: number;
    isAccomplished: boolean;
    deadline: Date | null;
    createdAt: Date;
};
