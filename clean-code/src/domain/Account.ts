import { randomUUID } from 'crypto';
import { InvalidFieldError } from '../infra/errors';
import { validatePassword } from '../utils/validatePassword';
import { validateCpf } from '../utils/validateCpf';

// Entity
export default class Account {
    constructor (
        readonly accountId: string,
        readonly name: string,
        readonly email: string,
        readonly cpf: string,
        readonly password: string,
        readonly carPlate: string,
        readonly isPassenger: boolean,
        readonly isDriver: boolean,
    ) {
        if (!this.validateName(name)) {
            throw new InvalidFieldError("Invalid name", {
                errorCode: -3
            });
        }

        if (!this.validateEmail(email)) {
            throw new InvalidFieldError("Invalid email", {
                errorCode: -2
            });
        }

        if (!validatePassword(password)) {
            throw new InvalidFieldError("Invalid password", {
                errorCode: -5
            });
        }

        if (!validateCpf(cpf)) {
            throw new InvalidFieldError("Invalid CPF", {
                errorCode: -1
            });
        }

        if (!isDriver) return;

        if (
            !carPlate?.match(/[A-Z]{3}[0-9]{4}/) &&
            !carPlate?.match(/[A-Z]{3}[0-9]{1}[A-Z]{1}[0-9]{2}/) // new plate format
        ) {
            throw new InvalidFieldError("Invalid car plate", {
                errorCode: -6
            });
        }
    }

    validateName (name: string) {
        return name?.match(/[a-zA-Z] [a-zA-Z]+/);
    }

    validateEmail (email: string) {
        return email?.match(/^(.+)@(.+)$/);
    }

    // Static factory method
    static create (
        name: string,
        email: string,
        cpf: string,
        password: string,
        carPlate: string,
        isPassenger: boolean,
        isDriver: boolean,
    ) {
        const accountId = randomUUID();
        const formattedCpf = cpf.replace(/\D/g,'');
        return new Account(accountId, name, email, formattedCpf, password, carPlate, isPassenger, isDriver);
    }
}
