import { validate } from 'uuid';
import { query } from '../infra/database';
import { ResourceNotFoundError } from '../infra/errors';

export default class getAccount {
    getUserByAccountId = async (accountId: string) => {
        if (!validate(accountId)) throw new ResourceNotFoundError(`AccountId ${accountId} not found`, { errorCode: -7 });

        try {
            const [user] = await query({
                query: `SELECT account_id, name, email, cpf, car_plate, is_passenger, is_driver FROM ccca.accounts WHERE account_id = $1;`,
                values: [accountId],
            });

            if (!user) throw new ResourceNotFoundError(`AccountId ${accountId} not found`, { errorCode: -7 });

            return user;
        } catch(err) {
            throw err;
        }
    }
}
