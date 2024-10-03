import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { requestActivationLinkFormRequirements } from "@/features/auth/components/requestActivationLinkForm/misc/requestActivationLinkFormRequirements";

export type RequestAccountActivationFormInputs = {
    email: string;
};

export const useRequestAccountActivationLinkForm = () =>
    useForm<RequestAccountActivationFormInputs>({
        resolver: yupResolver<RequestAccountActivationFormInputs>(requestActivationLinkFormRequirements),
    });
