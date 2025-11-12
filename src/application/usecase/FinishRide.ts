import { inject } from "../../infra/di/Registry";
import { ResourceNotFoundError } from "../../infra/errors";
import RideRepository from "../../infra/repository/RideRepository";

export default class FinishRide {
    @inject("rideRepository")
    rideRepository!: RideRepository;

    async execute(input: Input): Promise<void> {
        const { rideId } = input;
        const ride = await this.rideRepository.getRideById(rideId);
        if (!ride) throw new ResourceNotFoundError(`Ride with id ${input.rideId} not found`, { errorCode: -8 });
        ride.finish();
        await this.rideRepository.updateRideStatus(ride);
    }
}

type Input = {
    rideId: string,
}
