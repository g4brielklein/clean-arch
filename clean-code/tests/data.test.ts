import { AccountDAODatabase } from '../src/data';
import { randomUUID } from 'node:crypto';

const accountDAO = new AccountDAODatabase();

test("Should save an account", async () => {
    const accountInfo = {
        id: randomUUID(),
        name: 'John Doe',
        email: `johndoe${Math.random()}@gmail.com`,
        cpf: '97456321557',
        password: 'Abcd1234',
        isPassenger: true,
    };

    await accountDAO.saveAccount(accountInfo);
    const outputGetByEmail = await accountDAO.getAccountByEmail(accountInfo.email);
    expect(outputGetByEmail.account_id).toBe(accountInfo.id);
    const outputGetById = await accountDAO.getAccountById(accountInfo.id);
    expect(outputGetById.name).toBe(accountInfo.name);
    expect(outputGetById.email).toBe(accountInfo.email);
    expect(outputGetById.cpf).toBe(accountInfo.cpf);
    expect(outputGetById.is_passenger).toBe(accountInfo.isPassenger);
});
