import { AccountRepositoryDatabase } from '../../src/infra/repository/AccountRepository';
import AccountRepository from '../../src/infra/repository/AccountRepository';
import Account from '../../src/domain/Account'
import DatabaseConnection, { PgPromiseAdapter } from '../../src/infra/database/DatabaseConnection';
import Registry from '../../src/infra/di/Registry';

test("Should save an account", async () => {
    let databaseConnection: DatabaseConnection;
    let accountRepository: AccountRepository;
    databaseConnection = new PgPromiseAdapter();
    accountRepository = new AccountRepositoryDatabase();
    Registry.getInstance().provide("accountRepository", accountRepository);
    Registry.getInstance().provide("databaseConnection", databaseConnection);

    const account = Account.create(
        'John Doe',
        `johndoe${Math.random()}@gmail.com`,
        '97456321558',
        'Abcd1234',
        '',
        true,
        false,
    );

    await accountRepository.saveAccount(account);

    const outputGetByEmail = await accountRepository.getAccountByEmail(account.getEmail());
    expect(outputGetByEmail?.getName()).toBe(account.getName());
    expect(outputGetByEmail?.getEmail()).toBe(account.getEmail());
    expect(outputGetByEmail?.getCpf()).toBe(account.getCpf());
    expect(outputGetByEmail?.isPassenger).toBe(account.isPassenger);
    const outputGetById = await accountRepository.getAccountById(account.getAccountId());
    expect(outputGetById?.getName()).toBe(account.getName());
    expect(outputGetById?.getEmail()).toBe(account.getEmail());
    expect(outputGetById?.getCpf()).toBe(account.getCpf());
    expect(outputGetById?.isPassenger).toBe(account.isPassenger);
    
    await databaseConnection.close();
});
