import { inject } from "../../infra/di/Registry";
import { ResourceNotFoundError } from "../../infra/errors";
import RideRepository from "../../infra/repository/RideRepository";
import ProcessPayment from "./ProcessPayment";

export default class FinishRide {
    @inject("rideRepository")
    rideRepository!: RideRepository;

    async execute(input: Input): Promise<void> {
        const { rideId } = input;
        const ride = await this.rideRepository.getRideById(rideId);
        if (!ride) throw new ResourceNotFoundError(`Ride with id ${input.rideId} not found`, { errorCode: -8 });
        ride.finish();
        await this.rideRepository.updateRideStatus(ride);
        const processPayment = new ProcessPayment();
        await processPayment.execute(input.rideId);
    }
}

type Input = {
    rideId: string,
}
