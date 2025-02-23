import { createParamDecorator, ExecutionContext, UnauthorizedException } from "@nestjs/common";

export const AuthenticatedUserContext = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
    const { user } = ctx.switchToHttp().getRequest();

    if (!user) {
        throw new UnauthorizedException();
    }

    return user;
});
