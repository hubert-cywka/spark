import { Author } from "@/modules/journal/authors/models/Author.model";

export const AuthorServiceToken = Symbol("AuthorServiceToken");

export interface IAuthorService {
    create(id: string): Promise<Author>;
    remove(id: string): Promise<void>;
}
