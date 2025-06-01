export const toSHA256 = async (value: string) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(value);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
};

export const numberFromString = (input: string, n: number) => {
    const FNV_PRIME = 0x01000193;
    let hash = 0x811c9dc5;

    for (let i = 0; i < input.length; i++) {
        hash ^= input.charCodeAt(i);
        hash = hash * FNV_PRIME;
        hash &= 0xffffffff;
    }

    hash = hash >>> 0;
    return (hash % n) + 1;
};
