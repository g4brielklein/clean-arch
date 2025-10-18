import Name from "../../src/domain/vo/Name";
import { InvalidFieldError } from "../../src/infra/errors";

test("Should create a valid name", () => {
    const name = new Name("John Doe");
    expect(name).toBeDefined();
});

test("Should not create an invalid name", () => {
    try {
        new Name("John");
    } catch (err: any) {
        expect(err).toBeInstanceOf(InvalidFieldError);
        expect(err.message).toBe("Invalid name");
        expect(err.errorCode).toBe(-3);
    }
});
