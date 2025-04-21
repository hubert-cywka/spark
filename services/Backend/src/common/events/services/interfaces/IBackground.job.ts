export interface IBackgroundJob {
    execute(): Promise<void>;
}
