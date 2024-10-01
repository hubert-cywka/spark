import { Tooltip as TooltipPopup } from "react-aria-components";
import styled, { css } from "styled-components";

export const TooltipStyled = {
    Popup: styled(TooltipPopup)`
        ${({ theme }) => css`
            background: ${theme.color.info.solid._200};
            border-radius: ${theme.radius._400};
            padding: ${theme.spacing._200} ${theme.spacing._400};

            font: ${theme.typography.body._100};
            color: ${theme.color.neutral.text._100};

            svg {
                fill: ${theme.color.info.solid._200};
            }
        `}
    `,
};
