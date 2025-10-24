import { InvalidFieldError } from "../../infra/errors";

export default class Cpf {
    private value: string;
    private CPF_LENGTH = 11

    constructor (cpf: string) {
        if (!this.validateCpf(cpf)) throw new InvalidFieldError("Invalid CPF", { errorCode: -1 });
        this.value = cpf.replace(/\D/g,'');
    }

    validateCpf = (cpf: string) => {
        if (!cpf) return false
        cpf = this.clearCpf(cpf)
        if (cpf.length !== this.CPF_LENGTH) return false
        if (this.isAllSameDigits(cpf)) return false
        const digit1 = this.calculateDigit(cpf, 10);
        const digit2 = this.calculateDigit(cpf, 11);
        return this.extractDigit(cpf) === `${digit1}${digit2}`
    }

    clearCpf = (cpf: string) => {
	    return cpf.replace(/\D/g,'');
    }

    isAllSameDigits = (cpf: string) => {
	    const [firstDigit] = cpf;
	    return [...cpf].every((digit: string) => digit === firstDigit)
    }

    calculateDigit = (cpf: string, factor: number) => {
        let total = 0;
        for (const digit of cpf) {
            if (factor > 1) {
                total += parseInt(digit) * factor--;
            }
        }
        const rest = total % 11;
        return (rest < 2) ? 0 : 11 - rest;
    }

    extractDigit = (cpf: string) => {
	    return cpf.substring(cpf.length - 2, cpf.length);
    }

    getValue () {
        return this.value;
    }
}
