import { Recipient } from "@/modules/alerts/models/Recipient.model";

export const RecipientServiceToken = Symbol("RecipientServiceToken");

export interface IRecipientService {
    create(id: string): Promise<Recipient>;
    remove(id: string): Promise<void>;
}
