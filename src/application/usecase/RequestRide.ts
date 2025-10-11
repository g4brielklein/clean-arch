import { inject } from "../../infra/di/Registry";
import AccountRepository from "../../infra/repository/AccountRepository";
import Ride from "../../domain/Ride";
import RideRepository from "../../infra/repository/RideRepository";

export default class RequestRide {
    @inject("accountRepository")
    accountRepository!: AccountRepository;
    @inject("rideRepository")
    rideRepository!: RideRepository;

    execute = async (input: Input): Promise<Output> => {
        const account = await this.accountRepository.getAccountById(input.passengerId);
        if (!account || !account.isPassenger) throw new Error("Requester must be a passengeer");
        // const hasActiveRide = await this.rideRepository.
        const ride = Ride.create(input.passengerId, input.fromLat, input.fromLong, input.toLat, input.toLong);
        await this.rideRepository.saveRide(ride);
        return {
            rideId: ride.rideId,
        }
    }
}

type Input = {
    passengerId: string,
    fromLat: number,
    fromLong: number,
    toLat: number,
    toLong: number,
}

type Output = {
    rideId: string,
}
