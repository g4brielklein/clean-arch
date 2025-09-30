import Account from '../../domain/Account';
import { ResourceAlreadyExistsError } from '../../infra/errors';

import AccountRepository from '../../infra/repository/AccountRepository';

export default class Signup {
    constructor(readonly accountRepository: AccountRepository) {}

    execute = async (fields: any) => {
        const account = Account.create(fields.name, fields.email, fields.cpf, fields.password, fields.carPlate, fields.isPassenger, fields.isDriver);

        const userAlreadyExists = await this.accountRepository.getAccountByEmail(account.email);
        if (userAlreadyExists) throw new ResourceAlreadyExistsError(`Email ${account.email} already exists`, { errorCode: -4 });

        await this.accountRepository.saveAccount(account);
        return { accountId: account.accountId };
    }
}
