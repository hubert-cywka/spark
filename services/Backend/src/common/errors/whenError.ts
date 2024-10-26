import { RpcException } from "@nestjs/microservices";

interface ConstructorOf<C> {
    new (...args: ReadonlyArray<never>): C;
}

export function whenError(error: unknown) {
    const actions = {
        is<T extends Error>(ErrorType: ConstructorOf<T>) {
            return {
                throw(err: Error) {
                    if (error instanceof ErrorType) {
                        throw err;
                    }

                    return actions;
                },

                throwRpcException(message: string) {
                    if (error instanceof ErrorType) {
                        throw new RpcException(message);
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
