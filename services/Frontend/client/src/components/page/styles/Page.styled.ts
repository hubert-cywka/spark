import styled, { css } from "styled-components";

export const PageStyled = {
    Container: styled.div`
        ${({ theme }) => css`
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;

            width: 100vw;
            min-height: 100vh;
            padding: ${theme.spacing._500};

            background: ${theme.color.neutral.background._300};
            color: ${theme.color.neutral.text._100};
        `}
    `,

    InnerWrapper: styled.div`
        ${({ theme }) => css`
            font: ${theme.typography.body._100};
            max-width: ${theme.breakpoints.xl};
            width: 100%;

            display: flex;
            flex-direction: column;
            align-items: center;
        `}
    `,
};
