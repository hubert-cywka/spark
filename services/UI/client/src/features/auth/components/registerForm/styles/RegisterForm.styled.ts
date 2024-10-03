import styled, { css } from "styled-components";

export const RegisterFormStyled = {
    NameWrapper: styled.div`
        ${({ theme }) => css`
            display: flex;
            justify-content: space-between;
            gap: ${theme.spacing._600};

            div {
                flex-grow: 1;
            }
        `}
    `,

    AgreementsWrapper: styled.div`
        ${({ theme }) => css`
            margin-top: ${theme.spacing._400};
        `}
    `,
};
