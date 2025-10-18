import { randomUUID } from 'crypto';
import { InvalidFieldError } from '../infra/errors';
import { validatePassword } from './validatePassword';
import Name from './vo/Name';
import Email from './vo/Email';
import Cpf from './vo/Cpf';

// Aggregate made from an Entity "Account" and VOs (UUID, Name, Email, Cpf, CarPlate, Pasword)
// All Aggregates have an Aggregate Root <AR>, and it is the Entity that "leads" the Aggregate
// Entity (Because it has an id and can suffer state mutation)
export default class Account {
    private name: Name
    private email: Email;
    private cpf: Cpf;

    constructor (
        readonly accountId: string,
        name: string,
        email: string,
        cpf: string,
        readonly password: string,
        readonly carPlate: string,
        readonly isPassenger: boolean,
        readonly isDriver: boolean,
    ) {
        this.name = new Name(name);
        this.cpf = new Cpf(cpf);
        this.email = new Email(email);

        if (!validatePassword(password)) {
            throw new InvalidFieldError("Invalid password", {
                errorCode: -5
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

    setCpf (cpf: string) {
        this.cpf = new Cpf(cpf);
    }

    getCpf () {
        return this.cpf.getValue();
    }

    setName (name: string) {
        this.name = new Name(name);
    }

    getName () {
        return this.name.getValue();
    }

    setEmail (email: string) {
        this.email = new Email(email);
    }
    
    getEmail () {
        return this.email.getValue();
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
        return new Account(accountId, name, email, cpf, password, carPlate, isPassenger, isDriver);
    }
}
