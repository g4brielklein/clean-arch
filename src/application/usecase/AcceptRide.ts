import { inject } from "../../infra/di/Registry";
import AccountRepository from "../../infra/repository/AccountRepository"

export default class AcceptRide {
    @inject("accountRepository")
    accountRepository!: AccountRepository;

    execute = async (input: Input): Promise<void> => {
        const account = await this.accountRepository.getAccountById(input.driverId);
        if (!account || !account.isDriver) throw new Error('Ride accepter must be a driver');
    }
}

type Input = {
    rideId: string,
    driverId: string,
}