interface ConstructorOf<C> {
    new (...args: ReadonlyArray<never>): C;
}

export function ifError(error: unknown) {
    const actions = {
        is<T extends Error>(ErrorType: ConstructorOf<T>) {
            return {
                throw(err: Error) {
                    if (error instanceof ErrorType) {
                        throw err;
                    }

                    return actions;
                },
            };
        },
        elseRethrow() {
            throw error;
        },
    };

    return actions;
}
