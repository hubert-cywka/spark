export class DatabaseLockFailureError extends Error {
    public constructor(lockId: string) {
        super(`Failed to acquire database lock. Lock id: ${lockId}`);
    }
}
