import { validate } from "uuid";
import { inject } from "../../infra/di/Registry";
import { ResourceNotFoundError } from "../../infra/errors";
import AccountRepository from "../../infra/repository/AccountRepository"
import RideRepository from "../../infra/repository/RideRepository";

export default class AcceptRide {
    @inject("accountRepository")
    accountRepository!: AccountRepository;
    @inject("rideRepository")
    rideRepository!: RideRepository;

    execute = async (input: Input): Promise<void> => {
        if (!validate(input.rideId)) throw new ResourceNotFoundError(`Ride with id ${input.rideId} not found`, { errorCode: -8 });
        
        const account = await this.accountRepository.getAccountById(input.driverId);
        if (!account || !account.isDriver) throw new Error('Ride accepter must be a driver');
        const ride = await this.rideRepository.getRideById(input.rideId);
        if (!ride) throw new ResourceNotFoundError(`Ride with id ${input.rideId} not found`, { errorCode: -8 });
        ride.accept(input.driverId);
        await this.rideRepository.updateRide(ride);
    }
}

type Input = {
    rideId: string,
    driverId: string,
}
