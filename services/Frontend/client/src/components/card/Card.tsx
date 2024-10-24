import { CardStyled } from "@/components/card/styles/Card.styled";
import { CardProps } from "@/components/card/types/Card";

export const Card = ({ children, size }: CardProps) => {
    return <CardStyled.Container size={size}>{children}</CardStyled.Container>;
};
