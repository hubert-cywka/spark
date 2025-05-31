import dayjs from "dayjs";

import { RetryBackoffPolicy } from "@/common/retry/RetryBackoffPolicy";

export class LinearRetryBackoffPolicy implements RetryBackoffPolicy {
    public constructor(
        private readonly baseInterval: number,
        private readonly multiplier: number = 1
    ) {}

    public getNextAttemptDelayInMs(attempt: number): number {
        return this.baseInterval * attempt * this.multiplier;
    }

    public getNextAttemptDate(attempt: number): Date {
        return dayjs().add(this.getNextAttemptDelayInMs(attempt), "milliseconds").toDate();
    }
}
