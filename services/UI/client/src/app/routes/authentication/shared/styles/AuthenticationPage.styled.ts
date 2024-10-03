import styled, { css } from "styled-components";

const ContentWrapper = styled.div`
    ${({ theme }) => css`
        width: 500px;

        display: flex;
        flex-direction: column;
        gap: ${theme.spacing._400};
    `}
`;

export const AuthenticationPageStyled = {
    ContentWrapper,
};
