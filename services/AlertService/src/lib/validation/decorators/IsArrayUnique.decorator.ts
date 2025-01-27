import { registerDecorator, ValidationOptions } from "class-validator";

export function IsArrayUnique(validationOptions?: ValidationOptions) {
    return function (object: object, propertyName: string) {
        registerDecorator({
            name: "IsArrayUnique",
            target: object.constructor,
            propertyName: propertyName,
            constraints: [],
            options: {
                message: `${propertyName} must include unique values`,
                ...validationOptions,
            },
            validator: {
                validate(array: unknown[]) {
                    if (!Array.isArray(array)) return false;
                    const uniqueValues = new Set(array);
                    return uniqueValues.size === array.length;
                },
            },
        });
    };
}
