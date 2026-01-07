export type GoalFilters = {
    entries?: string[];
    name?: string;
    excludeEntries?: string[];
    withProgress?: boolean;
    updatedAfter?: Date;
    updatedBefore?: Date;
};
