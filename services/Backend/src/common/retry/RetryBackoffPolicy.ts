export interface RetryBackoffPolicy {
    getNextAttemptDelayInMs(attempt: number): number;
    getNextAttemptDate(attempt: number): Date;
}
