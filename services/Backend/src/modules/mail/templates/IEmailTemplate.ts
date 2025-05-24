export interface IEmailTemplate {
    getTemplateId(): string;
    getTemplateVariables(): Record<string, unknown>;
}
