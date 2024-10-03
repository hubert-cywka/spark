import { Checkbox as BaseCheckbox } from "react-aria-components";
import styled, { css } from "styled-components";

const Svg = styled.svg`
    ${({ theme }) => css`
        width: 1.25rem;
        height: 1.25rem;

        fill: none;
        stroke: ${theme.color.neutral.text._100};

        stroke-width: 3px;
        stroke-dasharray: 22px;
        stroke-dashoffset: 66;

        transition: all 200ms;
    `}
`;

const SvgWrapper = styled.div`
    ${({ theme }) => css`
        border: 1px solid ${theme.color.neutral.solid._200};
        border-radius: ${theme.radius._100};

        margin-right: ${theme.spacing._200};
        width: 1.25rem;
        height: 1.25rem;

        display: flex;
        align-items: center;
        justify-content: center;

        transition: border-color 200ms;
    `}
`;

const RequiredMark = styled.span`
    ${({ theme }) => css`
        color: ${theme.color.danger.text._200};
    `}
`;

const Checkbox = styled(BaseCheckbox)`
    ${({ theme }) => css`
        --selected-color: ${theme.color.neutral.surface._200};
        --selected-color-pressed: ${theme.color.neutral.surface._100};
        --checkmark-color: ${theme.color.neutral.text._100};

        display: flex;
        align-items: center;
        gap: ${theme.spacing._200};

        font: ${theme.typography.caption._200};

        &[data-invalid] ${SvgWrapper} {
            border-color: ${theme.color.danger.solid._200};
        }

        &[data-pressed] ${SvgWrapper} {
            border-color: ${theme.color.accent.solid._200};
        }

        &[data-focus-visible] ${SvgWrapper} {
            outline: 2px solid ${theme.color.accent.solid._200};
        }

        &[data-selected],
        &[data-indeterminate] {
            ${SvgWrapper} {
                border-color: ${theme.color.accent.solid._200};
                background: ${theme.color.accent.solid._200};
            }

            ${Svg} {
                stroke-dashoffset: 44;
            }
        }

        &[data-indeterminate] {
            & ${Svg} {
                stroke: none;
            }
        }
    `}
`;

export const CheckboxStyled = {
    Svg,
    SvgWrapper,
    Checkbox,
    RequiredMark,
};
