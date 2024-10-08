import styled, { css } from "styled-components";

import { ToastVariant } from "@/components/toast/types/Toast";

const Container = styled.div<{ variant: ToastVariant }>`
    ${({ theme, variant }) => css`
        padding: ${theme.spacing._400};
        border-radius: ${theme.radius._200};

        background-color: ${theme.color[variant].solid._300};
        color: ${theme.color.neutral.text._100};

        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: ${theme.spacing._600};

        min-width: 300px;
    `}
`;

const Title = styled.h1`
    ${({ theme }) => css`
        font: ${theme.typography.body._100};
        font-weight: bolder;
    `}
`;

const Message = styled.p`
    ${({ theme }) => css`
        font: ${theme.typography.body._100};
    `}
`;

export const ToastStyled = {
    Container,
    Title,
    Message,
};
