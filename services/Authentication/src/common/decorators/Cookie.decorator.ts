import { createParamDecorator, ExecutionContext } from "@nestjs/common";

// TODO: Extract to common package
export const Cookies = createParamDecorator((data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return data ? request.cookies?.[data] : request.cookies;
});
