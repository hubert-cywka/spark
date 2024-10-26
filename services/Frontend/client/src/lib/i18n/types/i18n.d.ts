export type TranslationSource = {
    authentication: {
        common: {
            fields: {
                firstName: {
                    label: string;
                    errors: {
                        required: string;
                        tooLong: string;
                        invalid: string;
                    };
                };
                lastName: {
                    label: string;
                    errors: {
                        required: string;
                        tooLong: string;
                        invalid: string;
                    };
                };
                email: {
                    label: string;
                    errors: {
                        required: string;
                        invalid: string;
                    };
                };
                password: {
                    label: string;
                    errors: {
                        required: string;
                        weak: string;
                    };
                };
                confirmPassword: {
                    label: string;
                    errors: {
                        mismatch: string;
                    };
                };
                termsAndConditions: {
                    label: string;
                };
            };
        };
        login: {
            notifications: {
                success: {
                    title: string;
                    body: string;
                };
                error: {
                    title: string;
                };
            };
            form: {
                header: string;
                submitButton: string;
                forgotPassword: {
                    link: string;
                };
                noAccount: {
                    caption: string;
                    link: string;
                };
                accountNotActivated: {
                    caption: string;
                    link: string;
                };
            };
        };
        registration: {
            notifications: {
                success: {
                    title: string;
                    body: string;
                };
                error: {
                    title: string;
                };
            };
            form: {
                header: string;
                submitButton: string;
                alreadyRegistered: {
                    caption: string;
                    link: string;
                };
            };
        };
        requestPasswordReset: {
            notifications: {
                success: {
                    title: string;
                    body: string;
                };
                error: {
                    title: string;
                };
            };
            form: {
                header: string;
                caption: string;
                logInLink: string;
                submitButton: string;
            };
        };
        passwordReset: {
            notifications: {
                success: {
                    title: string;
                    body: string;
                };
                error: {
                    title: string;
                };
            };
            form: {
                header: string;
                caption: string;
                submitButton: string;
                logInLink: {
                    caption: string;
                    link: string;
                };
            };
        };
        accountActivation: {
            notifications: {
                success: {
                    title: string;
                    body: string;
                };
                error: {
                    title: string;
                };
            };
            alert: {
                info: string;
                success: string;
                loading: string;
                logInLink: string;
            };
            form: {
                header: string;
                caption: string;
                warning: string;
                submitButton: string;
            };
        };
    };
};

type Leaves<T> = T extends object
    ? {
          [K in keyof T]: `${Exclude<K, symbol>}${Leaves<T[K]> extends never ? "" : `.${Leaves<T[K]>}`}`;
      }[keyof T]
    : never;

export type TranslationKey = Leaves<TranslationSource>;
