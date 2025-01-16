export const getEntryElementId = (entryId: string) => `entry-${entryId}`;
export const getEntryPlaceholderElementId = (dailyId: string) => `entry-placeholder-${dailyId}`;

export const getEntryFocusableElement = (entryId: string) => {
    return document.getElementById(getEntryElementId(entryId));
};

export const getEntryPlaceholderFocusableElement = (dailyId: string) => {
    return document.getElementById(getEntryPlaceholderElementId(dailyId));
};
