export const ServiceToServiceClientToken = Symbol("ServiceToServiceClientToken");

export interface IServiceToServiceClient {
    get<T>(service: string, endpoint: string): Promise<T>;
}
