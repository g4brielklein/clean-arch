import { randomUUID } from 'node:crypto';
import { validate } from 'uuid';
import { InvalidFieldError, ResourceAlreadyExistsError, ResourceNotFoundError } from '../../infra/errors';
import { validateCpf } from '../utils/validateCpf';
import { validatePassword } from '../utils/validatePassword';
import { query } from '../../infra/database';

interface User { 
    name: string, 
    email: string, 
    cpf: string, 
    carPlate?: string, 
    isPassenger?: boolean, 
    isDriver?: boolean, 
    password: string,
};

export const createUser = async (fields: User) => {
    const { name, email, cpf, carPlate, isPassenger, isDriver, password } = fields;
    const id = randomUUID();

    try {
        const [userAlreadyExists] = await query({
            query: "SELECT account_id FROM ccca.accounts WHERE email = $1;",
            values: [email],
        });
        if (userAlreadyExists) throw new ResourceAlreadyExistsError(`Email ${email} already exists`, { errorCode: -4 });
        validateFields(fields);
    	const formattedCpf = cpf.replace(/\D/g,'');
        await query({
            query: "INSERT INTO ccca.accounts (account_id, name, email, cpf, car_plate, is_passenger, is_driver, password) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)",
            values: [id, name, email, formattedCpf, carPlate, !!isPassenger, !!isDriver, password],
        });
        return { accountId: id };
    } catch(err) {
        throw err;
    }
}

export const validateFields = (fields: User) => {
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

export const getUserByAccountId = async (accountId: string) => {
    if (!validate(accountId)) throw new ResourceNotFoundError(`AccountId ${accountId} not found`, { errorCode: -7 });

    try {
        const [user] = await query({
            query: `SELECT account_id, name, email, cpf, car_plate, is_passenger, is_driver FROM ccca.accounts WHERE account_id = $1;`,
            values: [accountId],
        });

        if (!user) throw new ResourceNotFoundError(`AccountId ${accountId} not found`, { errorCode: -7 });

        return user;
    } catch(err) {
        throw err;
    }
}
