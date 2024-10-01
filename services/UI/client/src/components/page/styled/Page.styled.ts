import styled, { css } from "styled-components";

export const PageStyled = {
    Container: styled.div`
        ${({ theme }) => css`
            display: flex;
            flex-direction: column;
            align-items: center;

            width: 100vw;
            min-height: 100vh;

            background: ${theme.color.neutral.background._300};
            color: ${theme.color.neutral.text._100};
        `}
    `,

    InnerWrapper: styled.div`
        ${({ theme }) => css`
            width: ${theme.breakpoints.xl};

            display: flex;
            flex-direction: column;
            align-items: center;
        `}
    `,
};
