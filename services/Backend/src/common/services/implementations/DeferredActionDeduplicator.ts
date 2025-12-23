import { Injectable } from "@nestjs/common";

import { IActionDeduplicator } from "@/common/services/interfaces/IActionDeduplicator";

@Injectable()
export class DeferredActionDeduplicator implements IActionDeduplicator {
    private readonly pendingCallbacks = new Set<string>();

    public run(id: string, callback: () => void | Promise<void>, time: number): boolean {
        if (this.pendingCallbacks.has(id)) {
            return false;
        }

        this.pendingCallbacks.add(id);

        setTimeout(async () => {
            this.pendingCallbacks.delete(id);
            await callback();
        }, time);

        return true;
    }
}
