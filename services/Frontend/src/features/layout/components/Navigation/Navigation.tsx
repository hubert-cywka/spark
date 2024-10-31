"use client";

import { usePathname } from "next/navigation";

import { NavigationItem } from "./components/NavigationItem/NavigationItem";
import { NavigationSection } from "./components/NavigationSection/NavigationSection";
import { useNavigation } from "./hooks/useNavigation";

import styles from "./styles/Navigation.module.scss";

export const Navigation = () => {
    const { sections } = useNavigation();
    const pathname = usePathname();

    return (
        <nav className={styles.navigation}>
            {sections.map((section) => (
                <NavigationSection key={section.label} label={section.label}>
                    {section.routes.map((route) => (
                        <NavigationItem key={route.label} {...route} isActive={route.target === pathname} />
                    ))}
                </NavigationSection>
            ))}
        </nav>
    );
};
