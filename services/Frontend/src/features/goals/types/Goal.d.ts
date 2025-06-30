export type Goal = {
    id: string;
    name: string;
    target: number;
    targetProgress: number;
    isAccomplished: boolean;
    // TODO: Expired goals shouldn't be shown in the goal linking popup.
    isExpired: boolean;
    deadline: Date | null;
    createdAt: Date;
};
