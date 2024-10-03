import * as yup from "yup";

import { emailValidationSchema } from "@/features/auth/schemas/passwordValidationSchema";

export const resetPasswordFormRequirements = yup.object({
    email: emailValidationSchema,
});
