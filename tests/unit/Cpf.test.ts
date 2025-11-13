import Cpf from "../../src/domain/vo/Cpf";
import { InvalidFieldError } from "../../src/infra/errors";

// Parameterized tests
test.each([
    "97456321558",
    "714287938-60",
    "974.563.215-58",
    "714.287.938-60"
])('Should validate CPF %s', (cpf: string) => {
    expect(new Cpf(cpf)).toBeDefined();
})

test.each([
    "",
    null,
    undefined,
    "111.111.111-11"
])('Should not validate CPF %s', (cpf: any) => {
    try {
        new Cpf(cpf);
    } catch (err: any) {
        expect(err).toBeInstanceOf(InvalidFieldError);
        expect(err.message).toBe("Invalid CPF");
        expect(err.errorCode).toBe(-1);
    }
})
