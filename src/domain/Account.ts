import Name from './vo/Name';
import Email from './vo/Email';
import Cpf from './vo/Cpf';
import Password from './vo/Password';
import CarPlate from './vo/CarPlate';
import UUID from './vo/UUID';

// Aggregate made from an Entity "Account" and VOs (UUID, Name, Email, Cpf, CarPlate, Password)
// All Aggregates have an Aggregate Root <AR>, and it is the Entity that "leads" the Aggregate
// Entity (Because it has an id and can suffer state mutation)
export default class Account {
    // VOs (Has one or more values, it's imutable)
    private accountId: UUID;
    private name: Name;
    private email: Email;
    private cpf: Cpf;
    private password: Password;
    private carPlate?: CarPlate;

    constructor (
        accountId: string,
        name: string,
        email: string,
        cpf: string,
        password: string,
        carPlate: string,
        readonly isPassenger: boolean,
        readonly isDriver: boolean,
    ) {
        this.accountId = new UUID(accountId);
        this.name = new Name(name);
        this.email = new Email(email);
        this.cpf = new Cpf(cpf);
        this.password = new Password(password);
        if (isDriver) this.carPlate = new CarPlate(carPlate);
    }

    getAccountId () {
        return this.accountId.getValue();
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

    setCpf (cpf: string) {
        this.cpf = new Cpf(cpf);
    }

    getCpf () {
        return this.cpf.getValue();
    }

    setPassword (password: string) {
        this.password = new Password(password);
    }

    getPassword () {
        return this.password.getValue();
    }

    setCarPlate (carPlate: string) {
        this.carPlate = new CarPlate(carPlate);
    }

    getCarPlate () {
        return this.carPlate?.getValue();
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
        const accountId = UUID.create().getValue();
        return new Account(accountId, name, email, cpf, password, carPlate, isPassenger, isDriver);
    }
}
