import { type CallHandler, type ExecutionContext, type NestInterceptor, Injectable } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import type { Observable } from "rxjs";
import { map } from "rxjs/operators";

@Injectable()
export class TransformToDtoInterceptor<T> implements NestInterceptor<T, T> {
    constructor(private readonly classType: new (...args: unknown[]) => T) {}

    intercept(context: ExecutionContext, next: CallHandler): Observable<T> {
        return next.handle().pipe(
            map((data) =>
                plainToInstance(this.classType, data, {
                    excludeExtraneousValues: true,
                })
            )
        );
    }
}
