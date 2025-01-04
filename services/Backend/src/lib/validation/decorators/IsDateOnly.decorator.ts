import { registerDecorator, ValidationOptions } from "class-validator";

export function IsOnlyDate(validationOptions?: ValidationOptions) {
    return function (object: object, propertyName: string) {
        registerDecorator({
            name: "IsOnlyDate",
            target: object.constructor,
            propertyName: propertyName,
            constraints: [],
            options: {
                message: "Provide date in YYYY-MM-DD format. Time is not allowed.",
                ...validationOptions,
            },
            validator: {
                validate(value: string) {
                    const regex = /([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/;
                    return regex.test(value);
                },
            },
        });
    };
}
