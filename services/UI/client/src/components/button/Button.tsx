import { Button as BaseButton } from "react-aria-components";
import styled, { css } from "styled-components";

type ButtonVariant = "primary" | "secondary" | "confirm" | "danger";
type ButtonSize = "1" | "2" | "3";
type ButtonProps = {
    variant?: ButtonVariant;
    size?: ButtonSize;
} & typeof BaseButton;

export const Button = styled(BaseButton).attrs<ButtonProps>((props) => {
    const variant: ButtonVariant = props.variant ?? "primary";
    const size: ButtonSize = props.size ?? "2";

    return {
        ...props,
        size,
        variant,
        "data-button-size": size,
        "data-button-variant": variant,
    };
})<ButtonProps>`
    ${({ theme }) => css`
        height: fit-content;
        border-radius: ${theme.radius._300};

        cursor: pointer;
        transition: transform 150ms ease;

        display: flex;
        justify-content: center;
        align-items: center;

        &[data-button-size="1"] {
            font: ${theme.typography.body._200};
            padding-block: ${theme.spacing._200};
            padding-inline: ${theme.spacing._400};
        }

        &[data-button-size="2"] {
            font: ${theme.typography.body._300};
            padding-block: ${theme.spacing._300};
            padding-inline: ${theme.spacing._500};
        }

        &[data-button-size="3"] {
            font: ${theme.typography.body._400};
            padding-block: ${theme.spacing._300};
            padding-inline: ${theme.spacing._500};
        }

        &[data-button-variant="primary"] {
            border: ${theme.spacing._100} solid ${theme.color.accent.solid._300};
            color: ${theme.color.accent.text._100};
            background: ${theme.color.accent.solid._300};
        }

        &[data-button-variant="secondary"] {
            border: ${theme.spacing._100} solid ${theme.color.accent.solid._300};
            color: ${theme.color.accent.text._300};
            background: ${theme.color.accent.background._300};
        }

        &[data-button-variant="danger"] {
            border: ${theme.spacing._100} solid ${theme.color.danger.solid._300};
            color: ${theme.color.danger.text._300};
            background: ${theme.color.danger.surface._300};
        }

        &[data-button-variant="confirm"] {
            border: ${theme.spacing._100} solid ${theme.color.success.solid._300};
            color: ${theme.color.success.text._300};
            background: ${theme.color.success.surface._300};
        }

        &:disabled {
            filter: grayscale(0.9);
            cursor: not-allowed;
        }

        &:not(&:disabled) {
            &:hover {
                transform: scale(1.02);
            }

            &:active {
                transform: scale(0.98);
            }
        }

        &:focus {
            outline-offset: ${theme.spacing._100};
            outline: ${theme.spacing._100} solid ${theme.color.accent.solid._300};
        }
    `}
`;
