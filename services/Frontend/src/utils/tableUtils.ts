export function denormalize<U, K extends PropertyKey, T extends Record<K, readonly U[]>>(data: readonly T[], column: K): T[] {
    return data.flatMap((row) => {
        const items = row[column];

        if (items.length === 0) {
            return [{ ...row, [column]: ["-"] }];
        }

        return items.map((item) => {
            return { ...row, [column]: [item] };
        }) as T[];
    });
}
