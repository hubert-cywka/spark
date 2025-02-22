import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { useCommonAuthenticationRequirements } from "@/features/auth/hooks";
import { useHookFormAdapter } from "@/hooks/useHookFormAdapter";

export type RequestAccountActivationFormInputs = {
    email: string;
};

export const useRequestAccountActivationLinkForm = () => {
    const { email } = useCommonAuthenticationRequirements();

    const requirements = yup.object({ email });

    return useHookFormAdapter<RequestAccountActivationFormInputs>({
        resolver: yupResolver<RequestAccountActivationFormInputs>(requirements),
    });
};
