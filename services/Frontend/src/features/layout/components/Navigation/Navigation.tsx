"use client";

import { usePathname } from "next/navigation";

import { NavigationItem } from "./components/NavigationItem/NavigationItem";
import { NavigationSection } from "./components/NavigationSection/NavigationSection";
import { useNavigation } from "./hooks/useNavigation";

import styles from "./styles/Navigation.module.scss";

import { AccessGuard } from "@/features/auth/components/AccessGuard/AccessGuard";

type NavigationProps = {
    isDisabled: boolean;
};

export const Navigation = ({ isDisabled }: NavigationProps) => {
    const { sections } = useNavigation();
    const pathname = usePathname();

    return (
        <nav className={styles.navigation} inert={isDisabled}>
            {sections.map((section) => (
                <AccessGuard key={section.label} requiredScopes={section.requiredScopes}>
                    <NavigationSection label={section.label}>
                        {section.routes.map((route) => (
                            <NavigationItem key={route.label} {...route} isActive={route.target === pathname} />
                        ))}
                    </NavigationSection>
                </AccessGuard>
            ))}
        </nav>
    );
};
