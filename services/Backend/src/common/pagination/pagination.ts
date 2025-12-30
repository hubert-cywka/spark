import { Brackets, SelectQueryBuilder, WhereExpressionBuilder } from "typeorm";

import { Order } from "@/common/pagination/types/Order";
import { PageOptions } from "@/common/pagination/types/PageOptions";

type CursorValues = Record<string, unknown>;

export const createPage = <T extends object>(data: T[], take: number, paginationKeys: (keyof T & string)[]) => {
    const meta = getPageMeta(data, take, paginationKeys);

    return {
        data: data.slice(0, take),
        meta: meta,
    };
};

export const createPaginationKeys = <T extends object>(paginationKeys: (keyof T & string)[]) => {
    return paginationKeys;
};

export const applyCursorBasedPagination = <T extends object>(
    queryBuilder: SelectQueryBuilder<T>,
    pageOptions: PageOptions,
    paginationKeys: (keyof T & string)[],
    alias: string = queryBuilder.alias
): SelectQueryBuilder<T> => {
    const order = pageOptions.order || Order.DESC;

    if (pageOptions.cursor) {
        const cursorData = decodeCursor(pageOptions.cursor);
        const operator = order === Order.ASC ? ">" : "<";

        queryBuilder.andWhere(
            new Brackets((qb) => {
                buildDynamicCursorCondition(qb, paginationKeys, cursorData, operator, alias);
            })
        );
    }

    paginationKeys.forEach((key) => {
        queryBuilder.addOrderBy(`${alias}.${key}`, order);
    });

    queryBuilder.take(pageOptions.take + 1);

    return queryBuilder;
};

const getPageMeta = <T extends object>(data: T[], take: number, paginationKeys: (keyof T & string)[]) => {
    const hasNextPage = data.length > take;

    if (!hasNextPage) {
        return { nextCursor: null, hasNextPage: false };
    }

    const lastVisibleItem = data[take - 1];

    const cursorValues: CursorValues = {};
    paginationKeys.forEach((key) => {
        cursorValues[key] = lastVisibleItem[key];
    });

    return {
        nextCursor: encodeCursor(cursorValues),
        hasNextPage: true,
    };
};

const buildDynamicCursorCondition = (
    qb: WhereExpressionBuilder,
    keys: string[],
    values: CursorValues,
    operator: ">" | "<",
    alias: string
) => {
    keys.forEach((key, index) => {
        qb.orWhere(
            new Brackets((subQb) => {
                for (let i = 0; i < index; i++) {
                    subQb.andWhere(`${alias}.${keys[i]} = :val_${keys[i]}`, { [`val_${keys[i]}`]: values[keys[i]] });
                }
                subQb.andWhere(`${alias}.${key} ${operator} :val_${key}`, { [`val_${key}`]: values[key] });
            })
        );
    });
};

const encodeCursor = (values: CursorValues): string => {
    return Buffer.from(JSON.stringify(values)).toString("base64");
};

const decodeCursor = (cursor: string): CursorValues => {
    return JSON.parse(Buffer.from(cursor, "base64").toString("ascii"));
};
