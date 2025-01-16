export const onNextTick = (callback: () => unknown) => {
    setTimeout(callback, 0);
};
