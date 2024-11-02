import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { useCommonAuthenticationRequirements } from "@/features/auth/hooks";

export type RequestAccountActivationFormInputs = {
    email: string;
};

export const useRequestAccountActivationLinkForm = () => {
    const { email } = useCommonAuthenticationRequirements();

    const requirements = yup.object({ email });

    return useForm<RequestAccountActivationFormInputs>({
        resolver: yupResolver<RequestAccountActivationFormInputs>(requirements),
    });
};
