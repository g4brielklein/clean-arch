import { validatePassword } from "../src/utils/validatePassword";

test.each([
    "aBc123az",
    "SADISAU11a",
    "23298393aZ",
    "a12345678Z",
])('Should validate password %s', (password: string) => {
    // Should have uppercase characters, lowercase and numbers
    // Sould have at least 8 characters

    const isValid = validatePassword(password);
    expect(isValid).toBe(true)
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

    const isValid = validatePassword(password);
    expect(isValid).toBe(false)
})
