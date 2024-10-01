import {
    FieldError as BaseFieldError,
    Input as BaseInput,
    Label as BaseLabel,
    TextField as BaseTextField,
} from "react-aria-components";
import styled, { css } from "styled-components";

import { InputProps } from "@/components/input/types/Input";

export const FieldStyled = {
    Controller: styled(BaseTextField)`
        ${({ theme }) => css`
            display: flex;
            flex-direction: column;
            gap: ${theme.spacing._200};
        `}
    `,

    Error: styled(BaseFieldError)`
        ${({ theme }) => css`
            font: ${theme.typography.body._100};
            color: ${theme.color.danger.solid._200};
        `}
    `,

    Label: styled(BaseLabel)`
        ${({ theme }) => css`
            font: ${theme.typography.caption._200};
            font-weight: bolder;
            color: ${theme.color.neutral.text._200};
        `}
    `,

    RequiredFieldHighlight: styled.span`
        ${({ theme }) => css`
            color: ${theme.color.danger.text._300};
        `}
    `,

    Input: styled(BaseInput).attrs<InputProps>(({ size = "2", ...props }) => ({
        size,
        "data-size": size,
        ...props,
    }))<InputProps>`
        ${({ theme, width }) => css`
            width: ${width}px;

            color: ${theme.color.neutral.text._100};
            background: ${theme.color.neutral.background._300};

            border: thin solid ${theme.color.neutral.solid._100};
            border-radius: ${theme.radius._100};

            &[data-size="1"] {
                font: ${theme.typography.body._100};
                padding: ${theme.spacing._100} ${theme.spacing._300};
            }

            &[data-size="2"] {
                font: ${theme.typography.body._200};
                padding: ${theme.spacing._200} ${theme.spacing._300};
            }

            &[data-size="3"] {
                font: ${theme.typography.body._200};
                padding: ${theme.spacing._300} ${theme.spacing._400};
            }

            &[data-disabled] {
                color: ${theme.color.neutral.text._300};
                background: ${theme.color.neutral.background._100};
                cursor: not-allowed;
            }

            &:not(&[data-disabled]) {
                &[data-invalid] {
                    border-color: ${theme.color.danger.surface._100};
                }

                &[data-hovered] {
                    background: ${theme.color.neutral.background._200};
                }

                &[data-focused] {
                    background: ${theme.color.neutral.background._200};
                    outline: ${theme.spacing._100} solid ${theme.color.accent.solid._200};
                }
            }
        `}
    `,
};
