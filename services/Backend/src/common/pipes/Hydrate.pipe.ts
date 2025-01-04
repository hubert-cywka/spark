import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common";
import { type ClassConstructor, plainToClass } from "class-transformer";

@Injectable()
export class HydratePipe<T> implements PipeTransform {
    constructor(private readonly targetClass: ClassConstructor<T>) {}

    transform(value: object, metadata: ArgumentMetadata): T {
        return plainToClass(this.targetClass, value);
    }
}
