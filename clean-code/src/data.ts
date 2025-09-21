import { query } from '../infra/database';

export default interface AccountDAO {
    getAccountByEmail (email: string): Promise<any>,
    getAccountById (id: string): Promise<any>,
    saveAccount (fields: any): Promise<void>,
}

export class AccountDAODatabase implements AccountDAO {
    async getAccountByEmail(email: string): Promise<any> {
        const [account] = await query({
            query: 'SELECT account_id FROM ccca.accounts WHERE email = $1;',
            values: [email],
        });

        return account;
    }

    async getAccountById(id: string): Promise<any> {
        const [account] = await query({
            query: 'SELECT account_id, name, email, cpf, car_plate, is_passenger, is_driver FROM ccca.accounts WHERE account_id = $1;',
            values: [id],
        });

        return account;
    }

    async saveAccount(fields: any): Promise<void> {
        const { id, name, email, cpf, carPlate, isPassenger, isDriver, password } = fields;

        const formattedCpf = cpf.replace(/\D/g,'');

        await query({
            query: 'INSERT INTO ccca.accounts (account_id, name, email, cpf, car_plate, is_passenger, is_driver, password) VALUES ($1, $2, $3, $4, $5, $6, $7, $8);',
            values: [id, name, email, formattedCpf, carPlate, !!isPassenger, !!isDriver, password],
        });
    }
}

export class AccountDAOMemory implements AccountDAO {
    accounts: any[] = []

    async getAccountByEmail(email: string): Promise<any> {
        return this.accounts.find((account: any) => account.email === email);
    }

    async getAccountById(accountId: string): Promise<any> {
        return this.accounts.find((account: any) => account.id === accountId);
    }

    async saveAccount(fields: any): Promise<void> {
        fields.cpf = fields.cpf.replace(/\D/g,'');
        this.accounts.push(fields);
    }
}
