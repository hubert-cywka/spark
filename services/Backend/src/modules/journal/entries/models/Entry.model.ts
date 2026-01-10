export type Entry = {
    id: string;
    date: string;
    authorId: string;
    content: string;
    isCompleted: boolean;
    isFeatured: boolean;
    createdAt: Date;
    updatedAt: Date;

    goals?: string[];
};
