export const wait = async (ms: number) => {
    await new Promise((resolve) => setTimeout(resolve, ms));
};

export const fromSeconds = (value: number) => {
    return value * 1000;
};

export const fromMinutes = (value: number) => {
    return fromSeconds(value) * 60;
};

export const fromHours = (value: number) => {
    return fromMinutes(value) * 60;
};
