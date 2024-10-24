import { ButtonStyled } from "@/components/button/styles/Button.styled";
import { ButtonProps } from "@/components/button/types/Button";
import { Spinner } from "@/components/spinner/Spinner";

export const Button = ({ children, isLoading, isDisabled, ...rest }: ButtonProps) => {
    return (
        <ButtonStyled.Button isDisabled={isLoading ?? isDisabled} {...rest}>
            {isLoading ? <Spinner size="1" /> : children}
        </ButtonStyled.Button>
    );
};
