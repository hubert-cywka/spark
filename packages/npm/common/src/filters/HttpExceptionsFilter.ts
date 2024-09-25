import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from "@nestjs/common";
import { HttpAdapterHost } from "@nestjs/core";

@Catch(HttpException)
export class HttpExceptionsFilter implements ExceptionFilter<HttpException> {
    constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

    catch(exception: HttpException, host: ArgumentsHost): void {
        const { httpAdapter } = this.httpAdapterHost;
        const ctx = host.switchToHttp();
        const statusCode = exception.getStatus();
        const message = exception.message;

        const responseBody = {
            message,
            statusCode,
            timestamp: new Date().toISOString(),
            path: httpAdapter.getRequestUrl(ctx.getRequest()),
        };

        httpAdapter.reply(ctx.getResponse(), responseBody, statusCode);
    }
}
