import styled, { css } from "styled-components";

import { AlertVariant } from "@/components/alert/types/Alert";

const Container = styled.div<{ variant: AlertVariant }>`
    ${({ theme, variant }) => css`
        border-radius: ${theme.radius._200};
        padding: ${theme.spacing._400} ${theme.spacing._500};

        background-color: ${theme.color[variant].surface._300};
        color: ${theme.color[variant].text._200};

        display: flex;
        flex-direction: row;
        align-items: center;
        gap: ${theme.spacing._400};
    `}
`;

const Message = styled.p`
    flex-grow: 1;
`;

const IconWrapper = styled.p`
    flex-shrink: 0;
`;

export const AlertStyled = {
    Container,
    Message,
    IconWrapper,
};
