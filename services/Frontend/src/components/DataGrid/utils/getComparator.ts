export function getComparator<TData>(sortColumn: keyof TData): (a: TData, b: TData) => number {
    return (a, b) => {
        const valueA = a[sortColumn];
        const valueB = b[sortColumn];

        if (isString(valueA) && isString(valueB)) {
            return valueA.localeCompare(valueB);
        }

        if (isBoolean(valueA) && isBoolean(valueB)) {
            return valueA === valueB ? 0 : valueA ? -1 : 1;
        }

        throw new Error(`Unsupported comparison type: ${typeof valueA} and ${typeof valueB}.`);
    };
}

const isString = (value: unknown): value is string => typeof value === "string";
const isBoolean = (value: unknown): value is boolean => typeof value === "boolean";
