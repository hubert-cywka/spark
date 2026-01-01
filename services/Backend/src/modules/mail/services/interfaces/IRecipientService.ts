import { Recipient } from "@/modules/mail/models/Recipient.model";

export const RecipientServiceToken = Symbol("RecipientServiceToken");

export interface IRecipientService {
    create(id: string, email: string): Promise<Recipient>;
    getById(id: string): Promise<Recipient>;
    remove(id: string): Promise<void>;
}
