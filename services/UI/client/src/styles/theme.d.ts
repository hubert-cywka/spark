declare module "styled-components" {
    export interface DefaultTheme extends Theme {}
}

export type Theme = {
    color: {
        foreground: {
            primary: string;
            secondary: string;
            inverted: string;
            accent: string;
            success: string;
            error: string;
            warning: string;
            info: string;
            disabled: string;
        };
        background: {
            primary: {
                neutral: string;
                hover: string;
                active: string;
                focus: string;
            };
            secondary: {
                neutral: string;
                hover: string;
                active: string;
                focus: string;
            };
            inverted: {
                neutral: string;
                hover: string;
                active: string;
                focus: string;
            };
            disabled: string;
            success: {
                primary: string;
                secondary: string;
            };
            error: {
                primary: string;
                secondary: string;
            };
            info: {
                primary: string;
                secondary: string;
            };
            warning: {
                primary: string;
                secondary: string;
            };
        };
        border: {
            neutral: string;
            hover: string;
            active: string;
            focus: string;
        };
    };
    shadow: {
        xs: string;
        s: string;
        m: string;
        l: string;
        xl: string;
    };
    typography: {
        title: {
            s: string;
            m: string;
            l: string;
        };
        body: {
            bold: {
                s: string;
                m: string;
                l: string;
            };
            neutral: {
                s: string;
                m: string;
                l: string;
            };
        };
        caption: {
            bold: {
                s: string;
                m: string;
                l: string;
            };
            neutral: {
                s: string;
                m: string;
                l: string;
            };
        };
    };
    spacing: {
        xxxs: string;
        xxs: string;
        xs: string;
        s: string;
        m: string;
        l: string;
        xl: string;
        xxl: string;
    };
    radius: {
        round: string;
        xs: string;
        s: string;
        m: string;
        l: string;
        xl: string;
    };
};
