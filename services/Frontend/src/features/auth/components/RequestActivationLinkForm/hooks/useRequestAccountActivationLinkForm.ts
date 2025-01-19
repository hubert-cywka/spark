import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { useCommonAuthenticationRequirements } from "@/features/auth/hooks";
import { useAdaptedForm } from "@/hooks/useAdaptedForm";

export type RequestAccountActivationFormInputs = {
    email: string;
};

export const useRequestAccountActivationLinkForm = () => {
    const { email } = useCommonAuthenticationRequirements();

    const requirements = yup.object({ email });

    return useAdaptedForm<RequestAccountActivationFormInputs>({
        resolver: yupResolver<RequestAccountActivationFormInputs>(requirements),
    });
};
