export const ActionDeduplicatorToken = Symbol("ActionDeduplicatorToken");

export interface IActionDeduplicator {
    run(id: string, callback: () => void | Promise<void>, time: number): boolean;
}
