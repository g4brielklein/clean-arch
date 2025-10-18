import { inject } from '../../infra/di/Registry';
import { validate } from 'uuid';
import { ResourceNotFoundError } from '../../infra/errors';
import AccountRepository from '../../infra/repository/AccountRepository';

export default class GetAccount {
    @inject("accountRepository")
    accountRepository!: AccountRepository

    execute = async (accountId: string): Promise<Output> => {
        if (!validate(accountId)) throw new ResourceNotFoundError(`AccountId ${accountId} not found`, { errorCode: -7 });

        const account = await this.accountRepository.getAccountById(accountId);

        if (!account) throw new ResourceNotFoundError(`AccountId ${accountId} not found`, { errorCode: -7 });
        return {
            accountId: account.accountId,
            name: account.getName(),
            email: account.getEmail(),
            cpf: account.getCpf(),
            password: account.password,
            carPlate: account.carPlate,
            isPassenger: account.isPassenger,
            isDriver: account.isDriver,
        };
    }
}

type Output = {
    accountId: string,
    name: string,
    email: string,
    cpf: string,
    password: string,
    carPlate?: string,
    isPassenger: boolean,
    isDriver: boolean,
}
