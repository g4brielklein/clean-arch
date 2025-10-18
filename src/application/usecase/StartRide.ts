import { inject } from "../../infra/di/Registry"
import RideRepository from "../../infra/repository/RideRepository";

export default class StartRide {
    @inject("rideRepository")
    rideRepository!: RideRepository;

    execute = async (input: Input): Promise<void> => {
        const ride = await this.rideRepository.getRideById(input.rideId);
        ride.start();
        await this.rideRepository.updateRideStatus(ride);
    }
}

type Input = {
    rideId: string,
}
