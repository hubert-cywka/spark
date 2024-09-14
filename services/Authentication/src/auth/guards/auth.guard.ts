import { CanActivate, ExecutionContext, Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";

import { CURRENT_JWT_VERSION } from "@/auth/constants";
import { IS_PUBLIC_KEY } from "@/auth/decorators/public.decorator";
import { User } from "@/user/models/user.model";

@Injectable()
export class AuthGuard implements CanActivate {
    private logger = new Logger(AuthGuard.name);

    constructor(
        private jwtService: JwtService,
        private reflector: Reflector
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        if (this.isPublic(context)) {
            return true;
        }

        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);

        if (!token) {
            this.logger.log("Access denied, no JWT provided.");
            throw new UnauthorizedException();
        }

        try {
            request["user"] = await this.extractUserFromToken(token);
        } catch {
            this.logger.log("Access denied, JWT not valid.");
            throw new UnauthorizedException();
        }

        return true;
    }

    private isPublic(context: ExecutionContext) {
        return this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [context.getHandler(), context.getClass()]);
    }

    private extractTokenFromHeader(request: Request): string | null {
        const [type, token] = request.headers.authorization?.split(" ") ?? [];
        return type === "Bearer" ? token : null;
    }

    private async extractUserFromToken(token: string): Promise<User | null> {
        const jwtPayload = await this.jwtService.verifyAsync<User & { ver: number }>(token);

        if (jwtPayload.ver !== CURRENT_JWT_VERSION) {
            throw new UnauthorizedException();
        }

        return {
            id: jwtPayload.id,
            email: jwtPayload.email,
        };
    }
}
