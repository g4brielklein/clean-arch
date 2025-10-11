import { inject } from '../../infra/di/Registry';
import { validate } from 'uuid';
import { ResourceNotFoundError } from '../../infra/errors';
import AccountRepository from '../../infra/repository/AccountRepository';

export default class GetAccount {
    @inject("accountRepository")
    accountRepository!: AccountRepository

    execute = async (accountId: string) => {
        if (!validate(accountId)) throw new ResourceNotFoundError(`AccountId ${accountId} not found`, { errorCode: -7 });

        const account = await this.accountRepository.getAccountById(accountId);

        if (!account) throw new ResourceNotFoundError(`AccountId ${accountId} not found`, { errorCode: -7 });
        return account;
    }
}
