import { PropsWithChildren } from "react";

import { PageStyled } from "@/components/page/styles/Page.styled";

type PageProps = PropsWithChildren;

export const Page = ({ children }: PageProps) => {
    return (
        <PageStyled.Container>
            <PageStyled.InnerWrapper>{children}</PageStyled.InnerWrapper>
        </PageStyled.Container>
    );
};
