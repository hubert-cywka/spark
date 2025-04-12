export const normalize = (value: number, range: { min: number; max: number }) => {
    const rangeWidth = range.max - range.min;
    let rawNormalizedValue = 0;

    if (rangeWidth > 0) {
        rawNormalizedValue = (value - range.min) / rangeWidth;
    } else if (value === range.min) {
        rawNormalizedValue = 0;
    }

    return Math.max(0, Math.min(1, rawNormalizedValue)) * 100;
};
