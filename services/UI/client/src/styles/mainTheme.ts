import { Theme } from "@/styles/theme";

const FONT_FAMILY = "'Montserrat', sans-serif";

const TYPOGRAPHY_BODY_WEIGHT = 550;
const TYPOGRAPHY_CAPTION_WEIGHT = 450;
const TYPOGRAPHY_TITLE_WEIGHT = 700;

export const mainTheme: Theme = {
    breakpoints: {
        xs: "700px",
        sm: "800px",
        md: "900px",
        lg: "1000px",
        xl: "1100px",
    },
    typography: {
        body: {
            _100: `${TYPOGRAPHY_BODY_WEIGHT} 0.875rem ${FONT_FAMILY}`,
            _200: `${TYPOGRAPHY_BODY_WEIGHT} 1rem ${FONT_FAMILY}`,
            _300: `${TYPOGRAPHY_BODY_WEIGHT} 1.25rem ${FONT_FAMILY}`,
            _400: `${TYPOGRAPHY_BODY_WEIGHT} 1.5rem ${FONT_FAMILY}`,
        },
        caption: {
            _100: `${TYPOGRAPHY_CAPTION_WEIGHT} 0.625rem ${FONT_FAMILY}`,
            _200: `${TYPOGRAPHY_CAPTION_WEIGHT} 0.75rem ${FONT_FAMILY}`,
        },
        title: {
            _100: `${TYPOGRAPHY_TITLE_WEIGHT} 1.75rem ${FONT_FAMILY}`,
            _200: `${TYPOGRAPHY_TITLE_WEIGHT} 2rem ${FONT_FAMILY}`,
            _300: `${TYPOGRAPHY_TITLE_WEIGHT} 2.5rem ${FONT_FAMILY}`,
            _400: `${TYPOGRAPHY_TITLE_WEIGHT} 3rem ${FONT_FAMILY}`,
            _500: `${TYPOGRAPHY_TITLE_WEIGHT} 3.5rem ${FONT_FAMILY}`,
        },
    },
    color: {
        accent: {
            solid: {
                _100: "#6651C0",
                _200: "#673CDD",
                _300: "#5B28CC",
            },
            text: {
                _100: "#EDECFF",
                _200: "#DFDDFF",
                _300: "#B2A7FF",
            },
            background: {
                _100: "#251D4D",
                _200: "#171529",
                _300: "#100F1E",
            },
            surface: {
                _100: "#52429D",
                _200: "#443486",
                _300: "#312168",
            },
        },
        neutral: {
            solid: {
                _100: "#5F606A",
                _200: "#6C6E79",
                _300: "#797B86",
            },
            text: {
                _100: "#EEEEF0",
                _200: "#BFBFC0",
                _300: "#797B86",
            },
            background: {
                _100: "#222325",
                _200: "#19191B",
                _300: "#111113",
            },
            surface: {
                _100: "#46484F",
                _200: "#393A40",
                _300: "#292A2E",
            },
        },
        danger: {
            solid: {
                _100: "#BB395A",
                _200: "#E61961",
                _300: "#D60055",
            },
            text: {
                _100: "#FFD0D7",
                _200: "#FFB0C7",
                _300: "#FF8DA4",
            },
            background: {
                _100: "#3C111B",
                _200: "#201315",
                _300: "#170E0F",
            },
            surface: {
                _100: "#8F2C44",
                _200: "#751D34",
                _300: "#530A20",
            },
        },
        success: {
            solid: {
                _100: "#00DB9E",
                _200: "#19E6A8",
                _300: "#297F5F",
            },
            text: {
                _100: "#BBF6DC",
                _200: "#9DECC8",
                _300: "#00DA9D",
            },
            background: {
                _100: "#0D2E21",
                _200: "#111C17",
                _300: "#0B130F",
            },
            surface: {
                _100: "#23694E",
                _200: "#185740",
                _300: "#063C2A",
            },
        },
        info: {
            solid: {
                _100: "#2C71AF",
                _200: "#198DE6",
                _300: "#0080D8",
            },
            text: {
                _100: "#CCE4FC",
                _200: "#AAC4DC",
                _300: "#79BAF8",
            },
            background: {
                _100: "#09121A",
                _200: "#0F1923",
                _300: "#0D2942",
            },
            surface: {
                _100: "#245E92",
                _200: "#194E7C",
                _300: "#02345A",
            },
        },
    },
    radius: {
        _100: "0.25rem",
        _200: "0.5rem",
        _300: "0.75rem",
        _400: "1rem",
        _500: "50%",
    },
    shadow: {
        elevation: {
            _100: "",
            _200: "",
            _300: "",
        },
    },
    spacing: {
        _100: "0.125rem",
        _200: "0.25rem",
        _300: "0.5rem",
        _400: "0.75rem",
        _500: "1rem",
        _600: "1.5rem",
        _700: "2rem",
        _800: "3rem",
    },
};
