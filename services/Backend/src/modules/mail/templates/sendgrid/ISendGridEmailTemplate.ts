export interface ISendGridEmailTemplate {
    getTemplateId(): string;
    getTemplateVariables(): Record<string, unknown>;
}
