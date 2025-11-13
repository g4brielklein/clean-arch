import Password from "../../src/domain/vo/Password";
import { InvalidFieldError } from "../../src/infra/errors";

test.each([
    "aBc123az",
    "SADISAU11a",
    "23298393aZ",
    "a12345678Z",
])('Should validate password %s', (password: string) => {
    // Should have uppercase characters, lowercase and numbers
    // Sould have at least 8 characters

    expect(new Password(password)).toBeDefined;
})

test.each([
    "",
    "asD123",
    "12345678",
    "asdfghjkl",
    "ASDFGHJKL",
])('Should not validate password %s', (password: string) => {
    // Should have uppercase characters, lowercase and numbers
    // Sould have at least 8 characters

    try {
        new Password(password);
    } catch (err: any) {
        expect(err).toBeInstanceOf(InvalidFieldError);
        expect(err.message).toBe("Invalid password");
        expect(err.errorCode).toBe(-5);
    }
})
