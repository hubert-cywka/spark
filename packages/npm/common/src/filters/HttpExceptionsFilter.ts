import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from "@nestjs/common";

@Catch(HttpException)
export class HttpExceptionsFilter implements ExceptionFilter<HttpException> {
    catch(exception: HttpException, host: ArgumentsHost): void {
        const ctx = host.switchToHttp();
        const statusCode = exception.getStatus();
        const message = exception.message;

        const response = ctx.getResponse();
        const request = ctx.getRequest();

        response.status(statusCode).json({
            message,
            statusCode,
            timestamp: new Date().toISOString(),
            path: request.url,
        });
    }
}
