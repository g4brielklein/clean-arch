import { validateCpf } from "../src/utils/validateCpf";

// Parameterized tests
test.each([
    "97456321558",
    "714287938-60",
    "974.563.215-58",
    "714.287.938-60"
])('Should validate CPF %s', (cpf: string) => {
    const isValid = validateCpf(cpf);
    expect(isValid).toBe(true);
})

test.each([
    "",
    null,
    undefined,
    "111.111.111-11"
])('Should not validate CPF %s', (cpf: any) => {
    const isValid = validateCpf(cpf);
    expect(isValid).toBe(false);
})
