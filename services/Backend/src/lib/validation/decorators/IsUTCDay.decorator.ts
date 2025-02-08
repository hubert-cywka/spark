import { isDecimal, registerDecorator, ValidationOptions } from "class-validator";

export function IsUTCDay(validationOptions?: ValidationOptions) {
    return function (object: object, propertyName: string) {
        registerDecorator({
            name: "IsUTCDay",
            target: object.constructor,
            propertyName: propertyName,
            constraints: [],
            options: {
                message: `${propertyName} must be a number in range 0-6 (Sunday is 0, Saturday is 6)`,
                ...validationOptions,
            },
            validator: {
                validate(value: number) {
                    return value >= 0 && value <= 6 && !isDecimal(value);
                },
            },
        });
    };
}
