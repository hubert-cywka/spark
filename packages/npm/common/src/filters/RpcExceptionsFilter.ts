import { ArgumentsHost, Catch, RpcExceptionFilter } from "@nestjs/common";
import { RpcException } from "@nestjs/microservices";
import { Observable, throwError } from "rxjs";

@Catch(RpcException)
export class RpcExceptionsFilter implements RpcExceptionFilter<RpcException> {
    catch(exception: RpcException, host: ArgumentsHost): Observable<unknown> {
        return throwError(() => exception.getError());
    }
}
