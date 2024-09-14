import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";

import { CURRENT_JWT_VERSION } from "@/auth/constants";
import { IS_PUBLIC_KEY } from "@/auth/decorators/public.decorator";
import { TokenPayload } from "@/auth/interfaces/token-payload.interface";
import { User } from "@/auth/interfaces/user.interface";

@Injectable()
export class AuthGuard implements CanActivate {
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
            throw new UnauthorizedException();
        }

        try {
            request["user"] = await this.extractUserFromToken(token);
        } catch {
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
        const jwtPayload = await this.jwtService.verifyAsync<TokenPayload>(token);

        if (jwtPayload.ver !== CURRENT_JWT_VERSION) {
            throw new UnauthorizedException();
        }

        return {
            name: jwtPayload.name,
            password: jwtPayload.password,
            email: jwtPayload.email,
        };
    }
}
