import Position from "../../domain/entity/Position";
import { inject } from "../../infra/di/Registry";
import PositionRepository from "../../infra/repository/PositionRepository";
import RideRepository from "../../infra/repository/RideRepository"
import DistanceCalculator from "../../domain/service/DistanceCalculator";
import { FareCalculatorFactory } from "../../domain/service/FareCalculator";
import { ResourceNotFoundError } from "../../infra/errors";
import { validate } from "uuid";

export default class UpdatePosition {
    @inject("rideRepository")
    rideRepository!: RideRepository;
    @inject("positionRepository")
    positionRepository!: PositionRepository;
    
    execute = async (input: Input): Promise<void> => {
        if (!validate(input.rideId)) throw new ResourceNotFoundError(`Ride with id ${input.rideId} not found`, { errorCode: -8 });

        const lastPosition = await this.positionRepository.getLastPositionByRideId(input.rideId);
        const currentPosition = Position.create(input.rideId, input.lat, input.long, input.date);
        await this.positionRepository.savePosition(currentPosition);
        const ride = await this.rideRepository.getRideById(input.rideId);
        if (!ride) throw new ResourceNotFoundError(`Ride with id ${input.rideId} not found`, { errorCode: -8 });
        if (lastPosition) {
            const distance = DistanceCalculator.calculateFromPositions([lastPosition, currentPosition]);
            const fare = FareCalculatorFactory.create(currentPosition.getDate()).calculate(distance);
            ride.setDistance(ride.getDistance() + distance);
            ride.setFare(ride.getFare() + fare);
            await this.rideRepository.updateRide(ride);
        }
    }
}

type Input = {
    rideId: string,
    lat: number,
    long: number,
    date?: Date,
}
