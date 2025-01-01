// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type UseFactoryArgs = any[];
export type UseFactory<T> = (...args: UseFactoryArgs) => T | Promise<T>;
