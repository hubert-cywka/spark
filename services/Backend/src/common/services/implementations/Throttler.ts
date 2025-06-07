import { Injectable } from "@nestjs/common";

import { IThrottler } from "@/common/services/interfaces/IThrottler";

@Injectable()
export class Throttler implements IThrottler {
    private readonly pendingCallbacks = new Set<string>();

    public throttle(id: string, callback: () => void, time: number): boolean {
        if (this.pendingCallbacks.has(id)) {
            return false;
        }

        this.pendingCallbacks.add(id);

        setTimeout(() => {
            callback();
            this.pendingCallbacks.delete(id);
        }, time);

        return true;
    }
}
