import { Brackets, SelectQueryBuilder, WhereExpressionBuilder } from "typeorm";

import { Order } from "@/common/pagination/types/Order";
import { PageOptions } from "@/common/pagination/types/PageOptions";

type CursorValues = Record<string, unknown>;

export const createPage = <T extends object>(data: T[], take: number, paginationKeys: (keyof T & string)[]) => {
    const hasNextPage = data.length > take;
    let nextCursor: string | null = null;

    const visibleData = data.slice(0, take);

    if (hasNextPage) {
        const lastVisibleItem = data[visibleData.length - 1];
        const cursorValues: CursorValues = {};

        for (const key of paginationKeys) {
            cursorValues[key] = lastVisibleItem[key];
        }

        nextCursor = encodeCursor(cursorValues);
    }

    const meta = {
        nextCursor,
        hasNextPage,
    };

    return {
        data: visibleData,
        meta: meta,
    };
};

export const createPaginationKeys = <T extends object>(paginationKeys: (keyof T & string)[]) => {
    return paginationKeys;
};

export const applyCursorBasedPagination = <T extends object>(
    queryBuilder: SelectQueryBuilder<T>,
    { order, take, cursor }: PageOptions,
    paginationKeys: (keyof T & string)[],
    alias: string = queryBuilder.alias
): SelectQueryBuilder<T> => {
    if (cursor) {
        const cursorData = decodeCursor(cursor);
        const operator = order === Order.ASC ? ">" : "<";

        queryBuilder.andWhere(
            new Brackets((qb) => {
                buildDynamicCursorCondition(qb, paginationKeys, cursorData, operator, alias);
            })
        );
    }

    for (const key of paginationKeys) {
        queryBuilder.addOrderBy(`${alias}.${key}`, order);
    }

    queryBuilder.take(take + 1);
    return queryBuilder;
};

const buildDynamicCursorCondition = (
    qb: WhereExpressionBuilder,
    keys: string[],
    values: CursorValues,
    operator: ">" | "<",
    alias: string
) => {
    qb.orWhere(
        new Brackets((outerQb) => {
            let prefix = "";
            const params: CursorValues = {};

            for (const key of keys) {
                params[key] = values[key];
                outerQb.orWhere(`${prefix}${alias}.${key} ${operator} :${key}`, params);
                prefix += `${alias}.${key} = :${key} AND `;
            }
        })
    );
};

const encodeCursor = (values: CursorValues): string => {
    return Buffer.from(JSON.stringify(values)).toString("base64");
};

const decodeCursor = (cursor: string): CursorValues => {
    return JSON.parse(Buffer.from(cursor, "base64").toString("ascii"));
};
