export const DatabaseLockServiceToken = Symbol("DatabaseLockServiceToken");

export interface IDatabaseLockService {
    acquireTransactionLock(lockId: string): Promise<void>;
    waitToAcquireTransactionLock(lockId: string): Promise<void>;
}
