import { type ExecutionContext, createParamDecorator } from "@nestjs/common";

export const Timezone = createParamDecorator(async (_: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const tz = request.headers["x-user-timezone"] || "UTC";
    return validateTimeZone(tz);
});

const validateTimeZone = (tz: string): string => {
    try {
        Intl.DateTimeFormat(undefined, { timeZone: tz });
        return tz;
    } catch {
        return "UTC";
    }
};
