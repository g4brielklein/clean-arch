import { AccountDAOMemory, AccountDAODatabase } from '../src/data';
import Signup from '../src/signup';
import GetAccount from '../src/getAccount';
import { randomUUID } from 'node:crypto';

const accountDAO = new AccountDAOMemory();
const signup = new Signup(accountDAO);
const getAccount = new GetAccount(accountDAO);

test("Should create an account with type passenger", async () => {
    const input = {
        id: randomUUID(),
        name: 'John Doe',
        email: `johndoe${Math.random()}@gmail.com`,
        cpf: '97456321558',
        password: 'Abcd1234',
        isPassenger: true,
    };
    const outputSignup = await signup.execute(input);
    expect(outputSignup.accountId).toBeDefined();

    const outputGetAccount = await getAccount.execute(outputSignup.accountId);
    expect(outputGetAccount.name).toBe(input.name);
    expect(outputGetAccount.email).toBe(input.email);
    expect(outputGetAccount.cpf).toBe(input.cpf);
});

test("Should create an account with type driver", async () => {
    const input = {
        id: randomUUID(),
        name: 'John Doe',
        email: `johndoe${Math.random()}@gmail.com`,
        cpf: '97456321558',
        password: 'Abcd1234',
        isPassenger: false,
        isDriver: true,
        carPlate: 'IOG5C77'
    };
    const outputSignup = await signup.execute(input);
    expect(outputSignup.accountId).toBeDefined();

    const outputGetAccount = await getAccount.execute(outputSignup.accountId);
    expect(outputGetAccount.name).toBe(input.name);
    expect(outputGetAccount.email).toBe(input.email);
    expect(outputGetAccount.cpf).toBe(input.cpf);
});

test("Should not create an user with invalid name", async () => {
    const input = {
        id: randomUUID(),
        name: 'JohnDoe',
        email: `johndoe${Math.random()}@gmail.com`,
        cpf: '97456321558',
        password: 'Abcd1234',
        isPassenger: true,
    };

    await expect(signup.execute(input)).rejects.toMatchObject({
        errorCode: -3,
        statusCode: 422,
    });
});

test("Should not create an user with invalid email", async () => {
    const input = {
        id: randomUUID(),
        name: 'John Doe',
        email: `johndoe${Math.random()}gmail.com`,
        cpf: '97456321558',
        password: 'Abcd1234',
        isPassenger: true,
    };

    await expect(signup.execute(input)).rejects.toMatchObject({
        errorCode: -2,
        statusCode: 422,
    });
});

test("Should not create an user with invalid CPF", async () => {
    const input = {
        id: randomUUID(),
        name: 'John Doe',
        email: `johndoe${Math.random()}@gmail.com`,
        cpf: '97456321557',
        password: 'Abcd1234',
        isPassenger: true,
    };

    await expect(signup.execute(input)).rejects.toMatchObject({
        errorCode: -1,
        statusCode: 422,
    });
});

test("Should not create an user with invalid password", async () => {
    const input = {
        id: randomUUID(),
        name: 'John Doe',
        email: `johndoe${Math.random()}@gmail.com`,
        cpf: '97456321558',
        password: 'Abcd123',
        isPassenger: true,
    };

    await expect(signup.execute(input)).rejects.toMatchObject({
        errorCode: -5,
        statusCode: 422,
    });
});

test("Should create an account using fake", async () => {
    const accountDAO = new AccountDAOMemory();
    const signup = new Signup(accountDAO);
    const getAccount = new GetAccount(accountDAO);

    const input = {
        id: randomUUID(),
        name: 'John Doe',
        email: `johndoe${Math.random()}@gmail.com`,
        cpf: '97456321558',
        password: 'Abcd1234',
        isPassenger: true,
    };

    const outputSignup = await signup.execute(input);
    expect(outputSignup.accountId).toBeDefined();
    const outputGetAccount = await getAccount.execute(outputSignup.accountId);
    expect(outputGetAccount.name).toBe(input.name);
    expect(outputGetAccount.email).toBe(input.email);
    expect(outputGetAccount.cpf).toBe(input.cpf);
    expect(outputGetAccount.isPassenger).toBe(input.isPassenger);
});
