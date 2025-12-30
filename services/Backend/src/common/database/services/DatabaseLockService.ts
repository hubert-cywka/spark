import { Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";

import { DatabaseLockFailureError } from "@/common/database/errors/DatabaseLockFailure.error";
import { IDatabaseLockService } from "@/common/database/services/IDatabaseLockService";
import { numberFromString } from "@/common/utils/hashUtils";

@Injectable()
export class DatabaseLockService implements IDatabaseLockService {
    constructor(
        private readonly dataSource: DataSource,
        private readonly connectionName: string
    ) {}

    async acquireTransactionLock(lockId: string): Promise<void> {
        const result = await this.dataSource.query(
            'SELECT pg_try_advisory_xact_lock($1, $2) as "acquired"',
            this.createLockIdsPair(lockId)
        );

        if (!result[0].acquired) {
            throw new DatabaseLockFailureError(lockId);
        }
    }

    async waitToAcquireTransactionLock(lockId: string): Promise<void> {
        await this.dataSource.query('SELECT pg_advisory_xact_lock($1, $2) as "acquired"', this.createLockIdsPair(lockId));
    }

    private createLockIdsPair(lockId: string): [number, number] {
        // Postgres uses 32-bit signed integer for advisory lock with 2 arguments.
        const MAX_INT32 = 2_147_483_647;
        return [numberFromString(this.connectionName, MAX_INT32), numberFromString(lockId, MAX_INT32)];
    }
}
