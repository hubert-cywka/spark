import { ValidateIf, ValidationOptions } from "class-validator";

export function IsNullable(options?: ValidationOptions): PropertyDecorator {
    return function IsNullableDecorator(prototype: object, propertyKey: string | symbol) {
        ValidateIf((obj) => obj[propertyKey] !== null, options)(prototype, propertyKey);
    };
}
