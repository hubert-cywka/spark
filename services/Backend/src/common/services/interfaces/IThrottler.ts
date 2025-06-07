export const ThrottlerToken = Symbol("ThrottlerToken");

export interface IThrottler {
    throttle(id: string, callback: () => void, time: number): boolean;
}
