import styled, { css } from "styled-components";

const ContentWrapper = styled.div`
    ${({ theme }) => css`
        max-width: 500px;
        width: 100%;

        display: flex;
        flex-direction: column;
        gap: ${theme.spacing._400};
    `}
`;

export const AuthenticationPageStyled = {
    ContentWrapper,
};
