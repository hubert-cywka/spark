export interface IEmailTemplate<T = Record<string, unknown>> {
    getTemplateId(): string;
    getTemplateVariables(): T;
}
