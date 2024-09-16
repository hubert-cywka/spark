import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

// TODO: Extract to a package
export interface Response<T> {
    data: T;
}

@Injectable()
export class TransformToDtoInterceptor<T> implements NestInterceptor<T, Response<T>> {
    constructor(private readonly classType: new (...args: unknown[]) => T) {}

    intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
        return next.handle().pipe(
            map((data) => ({
                data: plainToInstance(this.classType, data, {
                    excludeExtraneousValues: true,
                }),
            }))
        );
    }
}
