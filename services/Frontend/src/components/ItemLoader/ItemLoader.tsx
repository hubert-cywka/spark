"use client";

import { ItemLoaderProps } from "@/components/ItemLoader/types/ItemLoader";

export const ItemLoader = ({ shouldLoadNext, onLoadNext, children, root = null, margin = "100px" }: ItemLoaderProps) => {
    return (
        <>
            {children}
            <div
                ref={(node) => {
                    if (!node) {
                        return;
                    }

                    const observer = new IntersectionObserver(
                        async (_entries, observer) => {
                            if (!shouldLoadNext) {
                                observer.unobserve(node);
                                return;
                            }

                            await onLoadNext();
                        },
                        {
                            root,
                            rootMargin: margin,
                        }
                    );

                    observer.observe(node);
                }}
            />
        </>
    );
};
