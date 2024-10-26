import { Injectable } from "@nestjs/common";
import { ThrottlerGuard } from "@nestjs/throttler";

@Injectable()
export class ThrottlingGuard extends ThrottlerGuard {
    protected async getTracker(req: { ips: string[]; ip?: string }): Promise<string> {
        const ip = req.ips.length ? req.ips[0] : req.ip;
        return ip ?? "";
    }
}
