import { validate } from "uuid";
import { inject } from "../../infra/di/Registry"
import RideRepository from "../../infra/repository/RideRepository";
import { ResourceNotFoundError } from "../../infra/errors";

export default class StartRide {
    @inject("rideRepository")
    rideRepository!: RideRepository;

    execute = async (input: Input): Promise<void> => {
        if (!validate(input.rideId)) throw new ResourceNotFoundError(`Ride with id ${input.rideId} not found`, { errorCode: -8 });
        
        const ride = await this.rideRepository.getRideById(input.rideId);
        if (!ride) throw new ResourceNotFoundError(`Ride with id ${input.rideId} not found`, { errorCode: -8 });
        ride.start();
        await this.rideRepository.updateRideStatus(ride);
    }
}

type Input = {
    rideId: string,
}
