import { Author } from "@/modules/journal/author/models/Author.model";

export const AuthorServiceToken = Symbol("AuthorServiceToken");

export interface IAuthorService {
    create(id: string): Promise<Author>;
}
