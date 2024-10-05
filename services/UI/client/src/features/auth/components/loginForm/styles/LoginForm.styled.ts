import styled, { css } from "styled-components";

import { Anchor } from "@/components/anchor/Anchor";

export const LoginFormStyled = {
    Link: styled(Anchor)`
        ${({ theme }) => css`
            font: ${theme.typography.body._100};
        `}
    `,
};
