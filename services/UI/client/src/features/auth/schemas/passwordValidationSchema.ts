import * as yup from "yup";

const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_ERROR = `Password needs at least ${PASSWORD_MIN_LENGTH} characters.`;
const CONFIRM_PASSWORD_ERROR = "Passwords do not match.";

const EMAIL_REQUIRED_ERROR = "Email is required.";
const EMAIL_INCORRECT_ERROR = "Email has incorrect format.";

export const passwordValidationSchema = yup.string().required(PASSWORD_ERROR).min(PASSWORD_MIN_LENGTH, PASSWORD_ERROR);

export const confirmPasswordValidationSchema = (passwordFieldName: string) =>
    yup
        .string()
        .required(CONFIRM_PASSWORD_ERROR)
        .oneOf([yup.ref(passwordFieldName)], CONFIRM_PASSWORD_ERROR);

export const emailValidationSchema = yup.string().required(EMAIL_REQUIRED_ERROR).email(EMAIL_INCORRECT_ERROR);
