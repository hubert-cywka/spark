import * as XRegExp from "xregexp";
import * as yup from "yup";

import {
    confirmPasswordValidationSchema,
    emailValidationSchema,
    passwordValidationSchema,
} from "@/features/auth/schemas/passwordValidationSchema";

const LAST_NAME_MAX_LENGTH = 30;
const LAST_NAME_TOO_LONG_ERROR = `Name can't exceed ${LAST_NAME_MAX_LENGTH} letters.`;
const LAST_NAME_INVALID_ERROR = "Invalid last name.";
const LAST_NAME_REQUIRED_ERROR = "Last name is required.";

const FIRST_NAME_MAX_LENGTH = 30;
const FIRST_NAME_TOO_LONG_ERROR = `Name can't exceed ${FIRST_NAME_MAX_LENGTH} letters.`;
const FIRST_NAME_INVALID_ERROR = "Invalid first name";
const FIRST_NAME_REQUIRED_ERROR = "First name is required.";

const NAME_REGEX = XRegExp("^[\\p{L}]+([\\p{L}\\-\\s']+)*$");

export const registrationFormRequirements = yup.object({
    email: emailValidationSchema,
    password: passwordValidationSchema,
    confirmPassword: confirmPasswordValidationSchema("password"),
    firstName: yup
        .string()
        .required(FIRST_NAME_REQUIRED_ERROR)
        .max(FIRST_NAME_MAX_LENGTH, FIRST_NAME_TOO_LONG_ERROR)
        .matches(NAME_REGEX, FIRST_NAME_INVALID_ERROR),
    lastName: yup
        .string()
        .required(LAST_NAME_REQUIRED_ERROR)
        .max(LAST_NAME_MAX_LENGTH, LAST_NAME_TOO_LONG_ERROR)
        .matches(NAME_REGEX, LAST_NAME_INVALID_ERROR),
    termsAndConditions: yup.boolean().required().isTrue(),
});
