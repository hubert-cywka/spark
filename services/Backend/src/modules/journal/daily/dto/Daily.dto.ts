import { IsDateString, IsString } from "class-validator";

export class DailyDto {
    @IsString()
    id: string;

    @IsString()
    authorId: string;

    @IsDateString()
    date: string;

    @IsDateString()
    createdAt: string;

    @IsDateString()
    updatedAt: string;

    constructor({
        id,
        date,
        authorId,
        createdAt,
        updatedAt,
    }: {
        id: string;
        authorId: string;
        date: string;
        createdAt: string;
        updatedAt: string;
    }) {
        this.id = id;
        this.authorId = authorId;
        this.date = date;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}
