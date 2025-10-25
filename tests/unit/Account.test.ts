import Account from "../../src/domain/Account"
import { InvalidFieldError } from "../../src/infra/errors";

test("Should create a passenger account", () => {
    const account = Account.create(
        "Michael Scott",
        "michael@dundermifflinscranton.com",
        "97456321558",
        "Password1",
        "",
        true,
        false,
    );
    expect(account).toBeDefined();
})

test("Should not create an account with invalid UUID", () => {
    expect(() => new Account(
        "1",
        "Michael Scott",
        "michael@dundermifflinscranton.com",
        "97456321558",
        "Password1",
        "",
        true,
        false,
    )).toThrow(new Error("Invalid UUID"))
})

test("Should not create a driver account with invalid car plate", () => {
    try {
        Account.create(
            "Michael Scott",
            "michael@dundermifflinscranton.com",
            "97456321558",
            "Password1",
            "",
            false,
            true,
        );
    } catch (err: any) {
        expect(err).toBeInstanceOf(InvalidFieldError);
        expect(err.message).toBe("Invalid car plate");
        expect(err.errorCode).toBe(-6);
    }
})
