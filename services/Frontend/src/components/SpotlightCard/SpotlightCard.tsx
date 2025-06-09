"use client";

import { PropsWithChildren } from "react";
import classNames from "clsx";

import { Card, CardProps } from "@/components/Card";
import { useSpotlight } from "@/hooks/useSpotlight.ts";

type SpotlightCardProps = CardProps &
    PropsWithChildren<{
        className?: string;
        spotlightOpacity?: number;
    }>;

const SpotlightCard = ({ children, className, spotlightOpacity, ...props }: SpotlightCardProps) => {
    const { ref, handleMouseMove, spotlightClassName } = useSpotlight({
        spotlightOpacity,
    });

    return (
        <Card
            ref={ref}
            onMouseMove={handleMouseMove}
            className={classNames(spotlightClassName, className)}
            variant="semi-translucent"
            {...props}
        >
            {children}
        </Card>
    );
};

export default SpotlightCard;
