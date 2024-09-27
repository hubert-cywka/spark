import { Button as BaseButton, buttonClasses } from "@mui/base/Button";
import styled, { css } from "styled-components";

type ButtonProps = {
    variant?: "primary" | "secondary" | "success" | "error";
} & typeof BaseButton;

export const Button = styled(BaseButton)<ButtonProps>`
    font: ${(p) => p.theme.typography.body.bold.s};
    border: none;
    border-radius: ${(p) => p.theme.radius.m};

    padding-block: ${(p) => p.theme.spacing.s};
    padding-inline: ${(p) => p.theme.spacing.m};

    cursor: pointer;
    transition: all 150ms ease;

    display: flex;
    justify-content: center;

    ${(p) => {
        switch (p.variant) {
            case "primary":
                return css`
                    background: ${(p) => p.theme.color.foreground.accent};
                    color: ${(p) => p.theme.color.foreground.inverted};
                `;

            case "secondary":
                return css`
                    background: transparent;
                    border: 2px solid ${(p) => p.theme.color.foreground.primary};
                    color: ${(p) => p.theme.color.foreground.primary};
                `;

            case "success":
                return css`
                    background: ${(p) => p.theme.color.foreground.success};
                    color: ${(p) => p.theme.color.foreground.inverted};
                `;

            case "error":
                return css`
                    background: ${(p) => p.theme.color.foreground.error};
                    color: ${(p) => p.theme.color.foreground.inverted};
                `;
        }
    }}

    &.${buttonClasses.disabled} {
        background: ${(p) => p.theme.color.foreground.disabled};
        color: ${(p) => p.theme.color.foreground.primary};
        cursor: not-allowed;
    }

    &:hover {
        transform: scale(1.02);
    }

    &.${buttonClasses.active} {
        transform: scale(0.98);
    }

    &:focus,
    &.${buttonClasses.focusVisible} {
        outline: 2px solid ${(p) => p.theme.color.foreground.info};
        outline-offset: 2px;
    }
`;
