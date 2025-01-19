import { useMemo } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { useAdaptedForm } from "@/hooks/useAdaptedForm";

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

    return useAdaptedForm<CreateAccountWithOIDCFormInputs>({
        resolver: yupResolver<CreateAccountWithOIDCFormInputs>(requirements),
    });
};
