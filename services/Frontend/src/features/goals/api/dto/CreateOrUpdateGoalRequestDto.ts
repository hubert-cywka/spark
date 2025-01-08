export type CreateOrUpdateGoalRequestDto = {
    name: string;
    target: number;
    deadline: string | null;
};
