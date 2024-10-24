import { Link } from "react-aria-components";
import styled, { css } from "styled-components";

export const AnchorStyled = {
    Anchor: styled(Link)`
        ${({ theme }) => css`
            width: fit-content;
            outline: none;

            color: ${theme.color.accent.text._300};

            &[data-disabled] {
                color: ${theme.color.neutral.text._200};
                cursor: not-allowed;
            }

            &[data-hovered],
            &[data-pressed] {
                text-decoration: underline;
                cursor: pointer;

                &[data-hovered] {
                    color: ${theme.color.accent.text._200};
                }

                &[data-pressed] {
                    color: ${theme.color.accent.text._100};
                }
            }

            &[data-focused] {
                text-decoration: underline;
            }
        `}
    `,
};
