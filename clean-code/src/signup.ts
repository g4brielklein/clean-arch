import Account from '../src/domain/Account';
import { ResourceAlreadyExistsError } from '../infra/errors';

import AccountDAO from './data';

export default class Signup {
    constructor(readonly accountDAO: AccountDAO) {}

    execute = async (fields: any) => {
        const account = Account.create(fields.name, fields.email, fields.cpf, fields.password, fields.carPlate, fields.isPassenger, fields.isDriver);

        const userAlreadyExists = await this.accountDAO.getAccountByEmail(account.email);
        if (userAlreadyExists) throw new ResourceAlreadyExistsError(`Email ${account.email} already exists`, { errorCode: -4 });

        await this.accountDAO.saveAccount(account);
        return { accountId: account.accountId };
    }
}
