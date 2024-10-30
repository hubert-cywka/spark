export type Theme = {
    breakpoints: {
        xs: string;
        sm: string;
        md: string;
        lg: string;
        xl: string;
    };
    color: {
        accent: Color;
        neutral: Color;
        success: Color;
        danger: Color;
        info: Color;
    };
    typography: {
        title: {
            _100: string;
            _200: string;
            _300: string;
            _400: string;
            _500: string;
        };
        body: {
            _100: string;
            _200: string;
            _300: string;
            _400: string;
        };
        caption: {
            _100: string;
            _200: string;
        };
    };
    shadow: {
        elevation: {
            _100: string;
            _200: string;
            _300: string;
        };
    };
    spacing: {
        _100: string;
        _200: string;
        _300: string;
        _400: string;
        _500: string;
        _600: string;
        _700: string;
        _800: string;
    };
    radius: {
        _100: string;
        _200: string;
        _300: string;
        _400: string;
        _500: string;
    };
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
