export type ISODateString = `${string}-${string}-${string}` | `${number}-${number}-${number}`;

export type ISODateStringRange = {
    from: ISODateString;
    to: ISODateString;
};
