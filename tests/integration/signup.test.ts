import sinon from 'sinon';
import { AccountRepositoryMemory, AccountRepositoryDatabase, AccountRepositoryORM } from '../../src/infra/repository/AccountRepository';
import AccountRepository from '../../src/infra/repository/AccountRepository';
import Registry from '../../src/infra/di/Registry';
import Signup from '../../src/application/usecase/Signup';
import GetAccount from '../../src/application/usecase/GetAccount';
import DatabaseConnection, { PgPromiseAdapter } from '../../src/infra/database/DatabaseConnection';
import { randomUUID } from 'node:crypto';
import Account from '../../src/domain/Account';
// import ORM from '../../src/infra/orm/ORM';

let databaseConnection: DatabaseConnection
// let orm: ORM;
let accountRepository: AccountRepository;
let signup: Signup;
let getAccount: GetAccount;

beforeEach(() => {
    databaseConnection = new PgPromiseAdapter();
    // orm = new ORM()
    Registry.getInstance().provide("databaseConnection", databaseConnection);
    // Registry.getInstance().provide("orm", orm);
    accountRepository = new AccountRepositoryDatabase();
    // accountRepository = new AccountRepositoryORM()
    Registry.getInstance().provide("accountRepository", accountRepository);
    signup = new Signup();
    getAccount = new GetAccount();
    sinon.restore();
})

test("Should create an account with type passenger", async () => {
    const input = {
        name: 'John Doe',
        email: `johndoe${Math.random()}@gmail.com`,
        cpf: '97456321558',
        password: 'Abcd1234',
        isPassenger: true,
        isDriver: false,
    };

    const outputSignup = await signup.execute(input);
    expect(outputSignup.accountId).toBeDefined();
    const outputGetAccount = await getAccount.execute(outputSignup.accountId);
    expect(outputGetAccount.name).toBe(input.name);
    expect(outputGetAccount.email).toBe(input.email);
    expect(outputGetAccount.cpf).toBe(input.cpf);
    expect(outputGetAccount.isPassenger).toBe(input.isPassenger);
    expect(outputGetAccount.isDriver).toBe(false);
});

test("Should create an account with type driver", async () => {
    const input = {
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
    expect(outputGetAccount.isPassenger).toBe(false);
    expect(outputGetAccount.isDriver).toBe(input.isDriver);
});

test("Should not create an user with invalid name", async () => {
    const input = {
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

// // Test patterns

test("Should create an account using fake", async () => {
    const accountRepository = new AccountRepositoryMemory();
    Registry.getInstance().provide("accountRepository", accountRepository);
    const signup = new Signup();
    const getAccount = new GetAccount();

    const input = {
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

test("Should create an account using spy", async () => {
    const saveAccountSpy = sinon.spy(accountRepository, "saveAccount");
    const getAccountSpy = sinon.spy(accountRepository, "getAccountById");
    const input = {
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
    expect(saveAccountSpy.calledOnce).toBe(true);
    expect(getAccountSpy.calledWith(outputSignup.accountId)).toBe(true);
});

test("Should create an account using stub", async () => {
    const accountRepository = new AccountRepositoryDatabase();
    Registry.getInstance().provide("accountRepository", accountRepository);
    signup = new Signup();
    getAccount = new GetAccount();

    const input: any = {
        name: 'John Doe',
        email: `johndoe${Math.random()}@gmail.com`,
        cpf: '97456321558',
        password: 'Abcd1234',
        carPlate: 'IOG5C22',
        isPassenger: false,
        isDriver: true,
    };

    sinon.stub(AccountRepositoryDatabase.prototype, "saveAccount").resolves();
    sinon.stub(AccountRepositoryDatabase.prototype, "getAccountByEmail").resolves();
    sinon.stub(AccountRepositoryDatabase.prototype, "getAccountById").resolves(Account.create(input.name, input.email, input.cpf, input.password, input.carPlate, input.isPassenger, input.isDriver));

    const outputSignup = await signup.execute(input);
    expect(outputSignup.accountId).toBeDefined();

    const outputGetAccount = await getAccount.execute(outputSignup.accountId);
    expect(outputGetAccount.name).toBe(input.name);
    expect(outputGetAccount.email).toBe(input.email);
    expect(outputGetAccount.cpf).toBe(input.cpf);
    expect(outputGetAccount.isPassenger).toBe(input.isPassenger);
    expect(outputGetAccount.isDriver).toBe(input.isDriver);
});

test("Should create an account using mock", async () => {
    const accountRepository = new AccountRepositoryDatabase();
    Registry.getInstance().provide("accountRepository", accountRepository);
    signup = new Signup();
    getAccount = new GetAccount();
    
    const input = {
        id: randomUUID(),
        name: 'John Doe',
        email: `johndoe${Math.random()}@gmail.com`,
        cpf: '97456321558',
        password: 'Abcd1234',
        carPlate: "",
        isPassenger: true,
        isDriver: false
    };

    const accountDAOMock = sinon.mock(AccountRepositoryDatabase.prototype);

    accountDAOMock.expects("saveAccount").once().resolves();
    accountDAOMock.expects("getAccountByEmail").once().resolves();
    const outputSignup = await signup.execute(input);
    expect(outputSignup.accountId).toBeDefined();

    accountDAOMock.expects("getAccountById").once().withArgs(outputSignup.accountId).resolves(Account.create(input.name, input.email, input.cpf, input.password, input.carPlate, input.isPassenger, input.isDriver));
    const outputGetAccount = await getAccount.execute(outputSignup.accountId);
    expect(outputGetAccount.name).toBe(input.name);
    expect(outputGetAccount.email).toBe(input.email);
    expect(outputGetAccount.cpf).toBe(input.cpf);
    expect(outputGetAccount.isPassenger).toBe(input.isPassenger);

    accountDAOMock.verify();
});

afterEach(async () => {
    await databaseConnection.close();
})
