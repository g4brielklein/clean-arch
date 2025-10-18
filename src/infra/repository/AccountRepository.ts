import { inject } from '../di/Registry';
import DatabaseConnection from '../database/DatabaseConnection';
import Account from '../../domain/Account'

export default interface AccountRepository {
    getAccountByEmail (email: string): Promise<Account | undefined>,
    getAccountById (id: string): Promise<Account | undefined>,
    saveAccount (account: Account): Promise<void>,
}

export class AccountRepositoryDatabase implements AccountRepository {
    @inject("databaseConnection")
    databaseConnection!: DatabaseConnection;

    async getAccountByEmail(email: string): Promise<Account | undefined> {
        const [accountData] = await this.databaseConnection.query({
            query: 'SELECT * FROM ccca.accounts WHERE email = $1;',
            values: [email],
        });

        if (!accountData) return

        return new Account(accountData.account_id, accountData.name, accountData.email, accountData.cpf, accountData.password, accountData.car_plate, accountData.is_passenger, accountData.is_driver);
    }

    async getAccountById(id: string): Promise<Account | undefined> {
        const [accountData] = await this.databaseConnection.query({
            query: 'SELECT * FROM ccca.accounts WHERE account_id = $1;',
            values: [id],
        });
        if (!accountData) return

        return new Account(accountData.account_id, accountData.name, accountData.email, accountData.cpf, accountData.password, accountData.car_plate, accountData.is_passenger, accountData.is_driver);
    }

    async saveAccount(account: Account): Promise<void> {
        await this.databaseConnection.query({
            query: 'INSERT INTO ccca.accounts (account_id, name, email, cpf, car_plate, is_passenger, is_driver, password) VALUES ($1, $2, $3, $4, $5, $6, $7, $8);',
            values: [account.accountId, account.getName(), account.getEmail(), account.getCpf(), account.carPlate, !!account.isPassenger, !!account.isDriver, account.password],
        });
    }
}

export class AccountRepositoryMemory implements AccountRepository {
    accounts: any[] = []

    async getAccountByEmail(email: string): Promise<any> {
        return this.accounts.find((account: any) => account.email === email);
    }

    async getAccountById(accountId: string): Promise<any> {
        return this.accounts.find((account: any) => account.accountId === accountId);
    }

    async saveAccount(account: Account): Promise<void> {
        this.accounts.push(account);
    }
}
