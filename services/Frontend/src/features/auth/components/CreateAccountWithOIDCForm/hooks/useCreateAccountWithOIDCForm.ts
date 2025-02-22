import { useMemo } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { useHookFormAdapter } from "@/hooks/useHookFormAdapter";

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

    return useHookFormAdapter<CreateAccountWithOIDCFormInputs>({
        resolver: yupResolver<CreateAccountWithOIDCFormInputs>(requirements),
    });
};
