import { randomUUID } from 'node:crypto';
import { InvalidFieldError, ResourceAlreadyExistsError } from '../infra/errors';
import { validateCpf } from '../src/utils/validateCpf';
import { validatePassword } from '../src/utils/validatePassword';

import AccountDAO from './data';

interface User { 
    id: string,
    name: string, 
    email: string, 
    cpf: string, 
    carPlate?: string, 
    isPassenger?: boolean, 
    isDriver?: boolean, 
    password: string,
};
export default class Signup {
    constructor(readonly accountDAO: AccountDAO) {}

    execute = async (fields: User) => {
        const { email } = fields;
        fields.id = randomUUID();

        const userAlreadyExists = await this.accountDAO.getAccountByEmail(email);
        if (userAlreadyExists) throw new ResourceAlreadyExistsError(`Email ${email} already exists`, { errorCode: -4 });

        this.validateFields(fields);
        await this.accountDAO.saveAccount(fields);
        return { accountId: fields.id };
    }

    validateFields = (fields: User) => {
        const { name, email, password, cpf, isDriver, carPlate } = fields;

        if (!name?.match(/[a-zA-Z] [a-zA-Z]+/)) {
            throw new InvalidFieldError("Invalid name", {
                errorCode: -3
            });
        }

        if (!email?.match(/^(.+)@(.+)$/)) {
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
}
