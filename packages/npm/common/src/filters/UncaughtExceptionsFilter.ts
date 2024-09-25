import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus, Logger } from "@nestjs/common";
import { HttpAdapterHost } from "@nestjs/core";
import { RpcException } from "@nestjs/microservices";
import { Observable, throwError } from "rxjs";

@Catch()
export class UncaughtExceptionsFilter implements ExceptionFilter {
    private readonly logger = new Logger(UncaughtExceptionsFilter.name);

    constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

    catch(exception: unknown, host: ArgumentsHost): Observable<unknown> | void {
        if (exception instanceof RpcException) {
            return throwError(() => exception.getError());
        }

        const executionContext = host.getType();
        const error = typeof exception === "object" ? JSON.stringify(exception) : String(exception);
        this.logger.error({ error }, "Caught unexpected error.");

        switch (executionContext) {
            case "http":
                return this.handleHttpContext(host);

            case "rpc":
                return this.handleRpcContext(host);

            default:
                this.logger.error({ executionContext }, "Unsupported execution context.");
        }
    }

    private handleRpcContext(host: ArgumentsHost): Observable<unknown> {
        return throwError(() => "Internal server error.");
    }

    private handleHttpContext(host: ArgumentsHost): void {
        const { httpAdapter } = this.httpAdapterHost;
        const ctx = host.switchToHttp();
        const statusCode = HttpStatus.INTERNAL_SERVER_ERROR;

        const responseBody = {
            message: "Internal server error.",
            statusCode,
            timestamp: new Date().toISOString(),
            path: httpAdapter.getRequestUrl(ctx.getRequest()),
        };

        httpAdapter.reply(ctx.getResponse(), responseBody, statusCode);
    }
}
