export type GoalFilters = {
    entries?: string[];
    name?: string;
    excludeEntries?: string[];
    includeProgress?: boolean;
    updatedAfter?: Date;
    updatedBefore?: Date;
};
