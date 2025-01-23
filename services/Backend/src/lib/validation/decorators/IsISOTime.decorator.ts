import { registerDecorator, ValidationOptions } from "class-validator";

export function IsISOTime(validationOptions?: ValidationOptions) {
    return function (object: object, propertyName: string) {
        registerDecorator({
            name: "IsISOTime",
            target: object.constructor,
            propertyName: propertyName,
            constraints: [],
            options: {
                message: `${propertyName} must be a date in HH:MM:SS or HH:MM:SS:sss format`,
                ...validationOptions,
            },
            validator: {
                validate(value: string) {
                    const regex = /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)(\.\d{1,3})?$/;
                    return regex.test(value);
                },
            },
        });
    };
}
