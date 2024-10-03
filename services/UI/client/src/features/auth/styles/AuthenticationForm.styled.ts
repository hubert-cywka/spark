import { Form } from "react-aria-components";
import styled, { css } from "styled-components";

export const AuthenticationFormStyled = {
    Form: styled(Form)`
        ${({ theme }) => css`
            display: flex;
            flex-direction: column;
            gap: ${theme.spacing._300};
        `}
    `,

    Header: styled.h1`
        ${({ theme }) => css`
            font: ${theme.typography.title._200};
            font-weight: 500;
        `}
    `,

    Caption: styled.p`
        ${({ theme }) => css`
            color: ${theme.color.neutral.text._200};
        `}
    `,

    FieldsWrapper: styled.div`
        ${({ theme }) => css`
            display: flex;
            flex-direction: column;
            gap: ${theme.spacing._300};
            padding-block: ${theme.spacing._700};
        `}
    `,
};
