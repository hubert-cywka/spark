import { RpcException } from "@nestjs/microservices";

interface ConstructorOf<C> {
    new (...args: ReadonlyArray<never>): C;
}

export function whenError(error: unknown) {
    let handled = false;

    const actions = {
        is<T extends Error>(ErrorType: ConstructorOf<T>) {
            const shouldProceed = !handled && error instanceof ErrorType;

            return {
                throw(err: Error) {
                    if (shouldProceed) {
                        handled = true;
                        throw err;
                    }
                    return actions;
                },

                ignore() {
                    if (shouldProceed) {
                        handled = true;
                    }
                    return actions;
                },

                throwRpcException(message: string) {
                    if (shouldProceed) {
                        handled = true;
                        throw new RpcException(message);
                    }
                    return actions;
                },
            };
        },

        elseRethrow() {
            if (!handled) {
                throw error;
            }
        },
    };

    return actions;
}
