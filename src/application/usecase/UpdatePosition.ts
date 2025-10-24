import Position from "../../domain/Position";
import { inject } from "../../infra/di/Registry";
import PositionRepository from "../../infra/repository/PositionRepository";
import RideRepository from "../../infra/repository/RideRepository"
import DistanceCalculator from "../../domain/service/DistanceCalculator";
import FareCalculator from "../../domain/service/FareCalculator";
import { ResourceNotFoundError } from "../../infra/errors";
import { validate } from "uuid";

export default class UpdatePosition {
    @inject("rideRepository")
    rideRepository!: RideRepository;
    @inject("positionRepository")
    positionRepository!: PositionRepository;
    
    execute = async (input: Input): Promise<void> => {
        if (!validate(input.rideId)) throw new ResourceNotFoundError(`Ride with id ${input.rideId} not found`, { errorCode: -8 });
        
        const position = Position.create(input.rideId, input.lat, input.long);
        await this.positionRepository.savePosition(position);
        const positions = await this.positionRepository.getPositionsByRideId(input.rideId);
        const distance = DistanceCalculator.calculateFromPositions(positions);
        const fare = FareCalculator.calculate(distance);
        const ride = await this.rideRepository.getRideById(input.rideId);
        if (!ride) throw new ResourceNotFoundError(`Ride with id ${input.rideId} not found`, { errorCode: -8 });
        ride.setDistance(distance);
        ride.setFare(fare);
        await this.rideRepository.updateRide(ride);
    }
}

type Input = {
    rideId: string,
    lat: number,
    long: number,
}
