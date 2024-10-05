import { Button as BaseButton } from "react-aria-components";
import styled, { css } from "styled-components";

import { ButtonProps } from "@/components/button/types/Button";
import { alpha } from "@/styles/utilities";

export const ButtonStyled = {
    Button: styled(BaseButton).attrs<ButtonProps>(({ size = "2", variant = "primary", ...props }) => ({
        ...props,
        size,
        variant,
        "data-size": size,
        "data-variant": variant,
    }))<ButtonProps>`
        ${({ theme }) => css`
            height: fit-content;
            border-radius: ${theme.radius._100};

            cursor: pointer;
            transition: transform 150ms ease;

            display: flex;
            justify-content: center;
            align-items: center;

            &[data-size="1"] {
                font: ${theme.typography.body._100};
                padding: ${theme.spacing._100} ${theme.spacing._300};
            }

            &[data-size="2"] {
                font: ${theme.typography.body._200};
                padding: ${theme.spacing._200} ${theme.spacing._400};
            }

            &[data-size="3"] {
                font: ${theme.typography.body._200};
                padding: ${theme.spacing._300} ${theme.spacing._500};
            }

            &[data-variant="primary"] {
                border: ${theme.spacing._100} solid ${theme.color.accent.solid._300};
                color: ${theme.color.accent.text._100};
                background: ${theme.color.accent.solid._300};
            }

            &[data-variant="secondary"] {
                border: ${theme.spacing._100} solid ${theme.color.accent.solid._300};
                color: ${theme.color.accent.text._300};
                background: ${theme.color.accent.background._300};
            }

            &[data-variant="danger"] {
                border: ${theme.spacing._100} solid ${theme.color.danger.solid._300};
                color: ${theme.color.danger.text._300};
                background: ${theme.color.danger.surface._300};
            }

            &[data-variant="confirm"] {
                border: ${theme.spacing._100} solid ${theme.color.success.solid._300};
                color: ${theme.color.success.text._300};
                background: ${theme.color.success.surface._300};
            }

            &[data-variant="subtle"] {
                color: ${theme.color.neutral.text._100};
                background: ${alpha(theme.color.accent.solid._300, 0.1)};
                border: none;
            }

            &[data-disabled] {
                filter: grayscale(0.9);
                cursor: not-allowed;
            }

            &:not(&[data-disabled]) {
                &[data-hovered] {
                    transform: scale(1.02);
                }

                &[data-pressed] {
                    transform: scale(0.98);
                }
            }

            &[data-focused] {
                outline-offset: ${theme.spacing._100};
                outline: ${theme.spacing._100} solid ${theme.color.accent.solid._200};
            }
        `}
    `,
};
