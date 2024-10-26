export function alpha(hex: string, opacity?: number) {
    const normalizedHex = hex.length === 3 ? `${hex}${hex}` : hex;

    const r = parseInt(normalizedHex.slice(1, 3), 16);
    const g = parseInt(normalizedHex.slice(3, 5), 16);
    const b = parseInt(normalizedHex.slice(5, 7), 16);

    if (opacity) {
        return "rgba(" + r + ", " + g + ", " + b + ", " + opacity + ")";
    } else {
        return "rgb(" + r + ", " + g + ", " + b + ")";
    }
}
