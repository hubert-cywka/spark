import * as yup from "yup";

import { emailValidationSchema } from "@/features/auth/schemas/passwordValidationSchema";

export const requestActivationLinkFormRequirements = yup.object({
    email: emailValidationSchema,
});
