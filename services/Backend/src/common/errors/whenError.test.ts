import { whenError } from "./whenError";

class CustomError extends Error {
    constructor(message: string = "Custom error") {
        super(message);
    }
}

class AnotherError extends Error {
    constructor(message: string = "Another error") {
        super(message);
    }
}

describe("whenError", () => {
    it("should not throw if the specific error type is ignored", () => {
        const error = new CustomError();
        const action = () => whenError(error).is(CustomError).ignore().elseRethrow();

        expect(action).not.toThrow();
    });

    it("should throw the new specified error if the type matches", () => {
        const originalError = new CustomError();
        const newError = new Error();

        const action = () => whenError(originalError).is(CustomError).throw(newError).elseRethrow();

        expect(action).toThrow(newError);
    });

    it("should throw if ignored error type does not match ", () => {
        const originalError = new CustomError();
        const newError = new Error();

        const action = () => whenError(originalError).is(CustomError).throw(newError).is(AnotherError).ignore().elseRethrow();

        expect(action).toThrow(newError);
    });

    it("should rethrow the original error if no .is() condition matched", () => {
        const error = new CustomError();

        const action = () => whenError(error).is(AnotherError).ignore().elseRethrow();

        expect(action).toThrow(error);
    });
});
