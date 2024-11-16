import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

export type CreateAccountWithOIDCFormInputs = {
    hasAcceptedTermsAndConditions: boolean;
};

export const useCreateAccountWithOIDCForm = () => {
    const requirements = useMemo(
        () =>
            yup.object({
                hasAcceptedTermsAndConditions: yup.boolean().required().isTrue(),
            }),
        []
    );

    return useForm<CreateAccountWithOIDCFormInputs>({
        resolver: yupResolver<CreateAccountWithOIDCFormInputs>(requirements),
    });
};
