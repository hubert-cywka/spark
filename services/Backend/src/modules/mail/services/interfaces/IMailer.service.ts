export const MailerServiceToken = Symbol("IMailerServiceToken");

export interface IMailerService<T> {
    send(recipient: string, template: T): Promise<void>;
}
