export const PartitionAssignerToken = Symbol("PartitionAssigner");

export interface IPartitionAssigner {
    assign(partitionKey: string): number;
}
