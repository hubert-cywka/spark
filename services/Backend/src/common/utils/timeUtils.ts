export const wait = async (ms: number) => {
    await new Promise((resolve) => setTimeout(resolve, ms));
};

export const seconds = (value: number) => {
    return value * 1000;
};

export const minutes = (value: number) => {
    return seconds(value) * 60;
};

export const hours = (value: number) => {
    return minutes(value) * 60;
};
