import styled, { css } from "styled-components";

import { Anchor } from "@/components/anchor/Anchor";
import { Button } from "@/components/button/Button";

export const LoginFormStyled = {
    Form: styled.form`
      ${({ theme }) => css`
          display: flex;
          flex-direction: column;
          gap: ${theme.spacing._300};

          padding: ${theme.spacing._500};
      `}}
    `,

    Button: styled(Button)`
        ${({ theme }) => css`
            margin-block: ${theme.spacing._400} ${theme.spacing._200};
        `}
    `,

    Header: styled.h1`
        ${({ theme }) => css`
            font: ${theme.typography.title._200};
            font-weight: 500;

            margin-bottom: ${theme.spacing._500};
        `}
    `,

    ResetPasswordLink: styled(Anchor)`
        ${({ theme }) => css`
            font: ${theme.typography.caption._200};
        `}
    `,
};
