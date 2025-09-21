import AccountDAO from './data';
import { validate } from 'uuid';
import { ResourceNotFoundError } from '../infra/errors';

export default class GetAccount {
    constructor(readonly accountDAO: AccountDAO) {}

    execute = async (accountId: string) => {
        if (!validate(accountId)) throw new ResourceNotFoundError(`AccountId ${accountId} not found`, { errorCode: -7 });
        const account = await this.accountDAO.getAccountById(accountId);
        if (!account) throw new ResourceNotFoundError(`AccountId ${accountId} not found`, { errorCode: -7 });
        return account;
    }
}
