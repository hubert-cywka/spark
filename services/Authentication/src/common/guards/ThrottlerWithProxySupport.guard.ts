import { Injectable } from "@nestjs/common";
import { ThrottlerGuard } from "@nestjs/throttler";
import { Request } from "express";

// TODO: Extract to common package
@Injectable()
export class ThrottlerWithProxySupportGuard extends ThrottlerGuard {
    protected async getTracker(req: Request): Promise<string> {
        const ip = req.ips.length ? req.ips[0] : req.ip;
        return ip ?? "";
    }
}
