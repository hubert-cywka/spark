import styled, { css } from "styled-components";

import { CardSize } from "@/components/card/types/Card";

export const CardStyled = {
    Container: styled.div.attrs<{ size?: CardSize }>(({ size = "2" }) => ({
        "data-size": size,
        size,
    }))`
      ${({ theme }) => css`
          background: ${theme.color.neutral.background._200};
          border: thin solid ${theme.color.neutral.surface._200};
          border-radius: ${theme.radius._300};

          &[data-size="1"] {
              padding: ${theme.spacing._400};
          }

          &[data-size="2"] {
              padding: ${theme.spacing._600};
          }

          &[data-size="3"] {
              padding: ${theme.spacing._800};
          }
      `}}
    `,
};
