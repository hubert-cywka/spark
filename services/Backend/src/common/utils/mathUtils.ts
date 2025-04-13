export const mean = (...values: number[]) => {
    const numberOfEntries = values.length;

    if (!numberOfEntries) {
        return 0;
    }

    const mid = Math.floor(numberOfEntries / 2);

    return numberOfEntries % 2 !== 0 ? values[mid] : (values[mid - 1] + values[mid]) / 2;
};
