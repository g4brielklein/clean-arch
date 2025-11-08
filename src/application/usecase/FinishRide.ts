import { inject } from "../../infra/di/Registry";
import RideRepository from "../../infra/repository/RideRepository";

export default class FinishRide {
    @inject("rideRepository")
    rideRepository!: RideRepository;

    async execute(input: Input): Promise<void> {
        const { rideId } = input;
        const ride = await this.rideRepository.getRideById(rideId);
        if (!ride) throw new Error()
        ride.setStatus("finished");
        this.rideRepository.updateRideStatus(ride);
    }
}

type Input = {
    rideId: string,
}
