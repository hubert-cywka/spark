import * as yup from "yup";

const EMAIL_REQUIRED_ERROR = "Email is required.";
const PASSWORD_REQUIRED_ERROR = "Password is required.";

export const loginFormRequirements = yup.object({
    email: yup.string().required(EMAIL_REQUIRED_ERROR),
    password: yup.string().required(PASSWORD_REQUIRED_ERROR),
});
