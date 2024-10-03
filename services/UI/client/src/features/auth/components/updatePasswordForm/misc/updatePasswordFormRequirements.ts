import * as yup from "yup";

import {
    confirmPasswordValidationSchema,
    passwordValidationSchema,
} from "@/features/auth/schemas/passwordValidationSchema";

export const updatePasswordFormRequirements = yup.object({
    password: passwordValidationSchema,
    confirmPassword: confirmPasswordValidationSchema("password"),
});
