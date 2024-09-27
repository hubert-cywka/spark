import { Theme } from "@/styles/theme";

export const lightTheme: Theme = {
    color: {
        foreground: {
            primary: "#1F2937",
            secondary: "#4B5563",
            inverted: "#FFFFFF",
            accent: "#3B82F6",
            success: "#10B981",
            error: "#EF4444",
            warning: "#F59E0B",
            info: "#2563EB",
            disabled: "#ababab",
        },
        background: {
            primary: {
                neutral: "#E5E7EB",
                hover: "#D1D5DB",
                active: "#9CA3AF",
                focus: "#6B7280",
            },
            secondary: {
                neutral: "#F3F4F6",
                hover: "#E5E7EB",
                active: "#D1D5DB",
                focus: "#9CA3AF",
            },
            inverted: {
                neutral: "#374151",
                hover: "#4B5563",
                active: "#6B7280",
                focus: "#9CA3AF",
            },
            disabled: "#E5E7EB",
            success: {
                primary: "#D1FAE5",
                secondary: "#A7F3D0",
            },
            error: {
                primary: "#FEE2E2",
                secondary: "#FECACA",
            },
            info: {
                primary: "#DBEAFE",
                secondary: "#BFDBFE",
            },
            warning: {
                primary: "#FEF3C7",
                secondary: "#FDE68A",
            },
        },
        border: {
            neutral: "#D1D5DB",
            hover: "#9CA3AF",
            active: "#6B7280",
            focus: "#4B5563",
        },
    },
    shadow: {
        xs: "0px 1px 2px rgba(0, 0, 0, 0.05)",
        s: "0px 1px 3px rgba(0, 0, 0, 0.1)",
        m: "0px 4px 6px rgba(0, 0, 0, 0.1)",
        l: "0px 10px 15px rgba(0, 0, 0, 0.1)",
        xl: "0px 20px 25px rgba(0, 0, 0, 0.1)",
    },
    typography: {
        title: {
            s: "700 1.5rem 'Montserrat', sans-serif",
            m: "700 2rem 'Montserrat', sans-serif",
            l: "700 2.5rem 'Montserrat', sans-serif",
        },
        body: {
            bold: {
                s: "700 0.875rem 'Montserrat', sans-serif",
                m: "700 1rem 'Montserrat', sans-serif",
                l: "700 1.25rem 'Montserrat', sans-serif",
            },
            neutral: {
                s: "500 0.875rem 'Montserrat', sans-serif",
                m: "500 1rem 'Montserrat', sans-serif",
                l: "500 1.25rem 'Montserrat', sans-serif",
            },
        },
        caption: {
            bold: {
                s: "600 0.625rem 'Montserrat', sans-serif",
                m: "600 0.75rem 'Montserrat', sans-serif",
                l: "600 0.875rem 'Montserrat', sans-serif",
            },
            neutral: {
                s: "400 0.625rem 'Montserrat', sans-serif",
                m: "400 0.75rem 'Montserrat', sans-serif",
                l: "400 0.875rem 'Montserrat', sans-serif",
            },
        },
    },
    spacing: {
        xxxs: "0.125rem",
        xxs: "0.25rem",
        xs: "0.5rem",
        s: "0.75rem",
        m: "1rem",
        l: "1.5rem",
        xl: "2rem",
        xxl: "3rem",
    },
    radius: {
        round: "50%",
        xs: "0.25rem",
        s: "0.375rem",
        m: "0.5rem",
        l: "0.75rem",
        xl: "1rem",
    },
};
