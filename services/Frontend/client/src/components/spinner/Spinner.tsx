import { SpinnerStyled } from "@/components/spinner/styles/Spinner.styled";
import { SpinnerProps } from "@/components/spinner/types/Spinner";

export const Spinner = (props: SpinnerProps) => {
    return <SpinnerStyled.Spinner {...props} />;
};
