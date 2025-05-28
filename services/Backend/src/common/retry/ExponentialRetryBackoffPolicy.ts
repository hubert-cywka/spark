import dayjs from "dayjs";

import { RetryBackoffPolicy } from "@/common/retry/RetryBackoffPolicy";

export class ExponentialRetryBackoffPolicy implements RetryBackoffPolicy {
    public constructor(private readonly baseInterval: number) {}

    public getNextAttemptDelayInMs(attempt: number): number {
        return this.baseInterval * Math.pow(2, attempt);
    }

    public getNextAttemptDate(attempt: number): Date {
        return dayjs().add(this.getNextAttemptDelayInMs(attempt), "milliseconds").toDate();
    }
}
