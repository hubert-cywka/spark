export interface IEmailTemplate {
    getHtml(): string;
    getSubject(): string;
}
