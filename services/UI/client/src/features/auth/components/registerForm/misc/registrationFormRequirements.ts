import * as yup from "yup";

import {
    confirmPasswordValidationSchema,
    emailValidationSchema,
    passwordValidationSchema,
} from "@/features/auth/schemas/passwordValidationSchema";

const NAME_MAX_LENGTH = 30;
const NAME_REGEX = /^[a-zA-Z]([a-zA-Z\-\s']{0,29})$/;

const LAST_NAME_TOO_LONG_ERROR = `Name can't exceed ${NAME_MAX_LENGTH} letters.`;
const LAST_NAME_INVALID_ERROR = "Invalid last name.";
const LAST_NAME_REQUIRED_ERROR = "Last name is required.";

const FIRST_NAME_TOO_LONG_ERROR = `Name can't exceed ${NAME_MAX_LENGTH} letters.`;
const FIRST_NAME_INVALID_ERROR = "Invalid first name";
const FIRST_NAME_REQUIRED_ERROR = "First name is required.";

export const registrationFormRequirements = yup.object({
    email: emailValidationSchema,
    password: passwordValidationSchema,
    confirmPassword: confirmPasswordValidationSchema("password"),
    firstName: yup
        .string()
        .required(FIRST_NAME_REQUIRED_ERROR)
        .max(NAME_MAX_LENGTH, FIRST_NAME_TOO_LONG_ERROR)
        .matches(NAME_REGEX, FIRST_NAME_INVALID_ERROR),
    lastName: yup
        .string()
        .required(LAST_NAME_REQUIRED_ERROR)
        .max(NAME_MAX_LENGTH, LAST_NAME_TOO_LONG_ERROR)
        .matches(NAME_REGEX, LAST_NAME_INVALID_ERROR),
    hasAcceptedTermsAndConditions: yup.boolean().required().isTrue(),
});
