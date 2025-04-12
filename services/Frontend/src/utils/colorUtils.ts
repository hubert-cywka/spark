export const addOpacityToColor = (color: string, opacity: number): string => {
    if (color.startsWith("#") && color.length === 7) {
        const r = parseInt(color.slice(1, 3), 16);
        const g = parseInt(color.slice(3, 5), 16);
        const b = parseInt(color.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    }

    if (color.startsWith("#") && color.length === 9) {
        const r = parseInt(color.slice(1, 3), 16);
        const g = parseInt(color.slice(3, 5), 16);
        const b = parseInt(color.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    }

    if (color.startsWith("rgb(")) {
        return color.replace("rgb(", "rgba(").replace(")", `, ${opacity})`);
    }

    if (color.startsWith("rgba(")) {
        return color.replace(/[\d.]+\)$/g, `${opacity})`);
    }

    return color;
};

export const getColorFromPercentageBasedScore = (percent: number) => {
    const clampedPercent = Math.max(0, Math.min(100, percent));

    let r, g, b;
    if (clampedPercent <= 50) {
        r = 255;
        g = Math.floor((255 * clampedPercent) / 50);
        b = 0;
    } else {
        r = Math.floor((255 * (100 - clampedPercent)) / 50);
        g = 255;
        b = 100;
    }

    return `rgb(${r}, ${g}, ${b})`;
};
