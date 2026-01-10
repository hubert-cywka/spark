export type CreateEntryRequestDto = {
    date: string;
    content: string;
    isFeatured?: boolean;
    isCompleted?: boolean;
};
