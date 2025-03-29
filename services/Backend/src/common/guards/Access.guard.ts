import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthGuard } from "@nestjs/passport";

import { ACCESS_SCOPES_METADATA } from "@/common/decorators/AccessScope.decorator";
import { AccessScope } from "@/common/types/AccessScope";

@Injectable()
export class AccessGuard extends AuthGuard("jwt") implements CanActivate {
    constructor(private reflector: Reflector) {
        super();
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        await super.canActivate(context);

        const required = this.reflector.get<AccessScope[]>(ACCESS_SCOPES_METADATA, context.getHandler());

        if (!required) {
            return true;
        }

        const { user } = context.switchToHttp().getRequest();

        if (!user || !user.accessScopes) {
            throw new UnauthorizedException();
        }

        if (!required.every((scope) => user.accessScopes.includes(scope))) {
            throw new ForbiddenException();
        }

        return true;
    }
}
