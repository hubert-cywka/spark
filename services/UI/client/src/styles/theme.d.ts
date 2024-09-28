declare module "styled-components" {
    export interface DefaultTheme extends Theme {}
}

export type Theme = {
    color: {
        accent: Color;
        neutral: Color;
        success: Color;
        danger: Color;
        info: Color;
    };
    typography: {
        title: Typography;
        body: Typography;
        caption: Typography;
    };
    shadow: {
        elevation: Shadow;
    };
    spacing: Size;
    radius: Radius;
};

type Shadow = {
    _100: string;
    _200: string;
    _300: string;
};

type Radius = {
    _100: string;
    _200: string;
    _300: string;
    _400: string;
    _500: string;
};

type Size = {
    _100: string;
    _200: string;
    _300: string;
    _400: string;
    _500: string;
    _600: string;
    _700: string;
    _800: string;
};

type Color = {
    solid: {
        _100: string;
        _200: string;
        _300: string;
    };
    text: {
        _100: string;
        _200: string;
        _300: string;
    };
    background: {
        _100: string;
        _200: string;
        _300: string;
    };
    surface: {
        _100: string;
        _200: string;
        _300: string;
    };
};

type Typography = {
    _100: string;
    _200: string;
    _300: string;
    _400: string;
    _500: string;
};
