import styled, { css } from "styled-components";

import { Button } from "@/components/button/Button";

const IconButton = styled(Button)`
    ${({ theme }) => css`
        aspect-ratio: 1;

        &[data-size="1"] {
            padding: ${theme.spacing._100};
        }

        &[data-size="2"] {
            padding: ${theme.spacing._200};
        }

        &[data-size="3"] {
            padding: ${theme.spacing._300};
        }
    `}
`;

export const IconButtonStyled = {
    IconButton,
};
