import { inject } from '../../infra/di/Registry';
import Account from '../../domain/Account';
import AccountRepository from '../../infra/repository/AccountRepository';
import { ResourceAlreadyExistsError } from '../../infra/errors';

export default class Signup {
    @inject("accountRepository")
    accountRepository!: AccountRepository

    execute = async (fields: any) => {
        const account = Account.create(fields.name, fields.email, fields.cpf, fields.password, fields.carPlate, fields.isPassenger, fields.isDriver);

        const userAlreadyExists = await this.accountRepository.getAccountByEmail(account.getEmail());
        if (userAlreadyExists) throw new ResourceAlreadyExistsError(`Account ${account.getEmail()} already exists`, { errorCode: -4 });

        await this.accountRepository.saveAccount(account);
        return { accountId: account.getAccountId() };
    }
}
