export type Entry = {
    id: string;
    daily: string;
    content: string;
    authorId: string;
    isCompleted: boolean;
    isFeatured: boolean;
    createdAt: Date;
    updatedAt: Date;

    goals?: { id: string; name: string }[];
};
