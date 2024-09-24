import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from "@nestjs/common";
import { HttpAdapterHost } from "@nestjs/core";

@Catch()
export class HttpExceptionsFilter implements ExceptionFilter {
    private readonly logger = new Logger(HttpExceptionsFilter.name);

    constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

    catch(exception: unknown, host: ArgumentsHost): void {
        const { httpAdapter } = this.httpAdapterHost;
        const ctx = host.switchToHttp();
        const isHttpException = exception instanceof HttpException;
        const statusCode = isHttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
        const message = isHttpException ? exception.message : "Internal server error.";

        if (!isHttpException) {
            // HTTPExceptions are not logged here by design, as logging just before those exceptions are thrown (or handled in controller) usually allows to add more context.
            this.logger.error({ err: exception }, "Caught unexpected exception.");
        }

        const responseBody = {
            message,
            statusCode,
            timestamp: new Date().toISOString(),
            path: httpAdapter.getRequestUrl(ctx.getRequest()),
        };

        httpAdapter.reply(ctx.getResponse(), responseBody, statusCode);
    }
}
