import Position from "../../domain/Position";
import { inject } from "../../infra/di/Registry";
import PositionRepository from "../../infra/repository/PositionRepository";
import RideRepository from "../../infra/repository/RideRepository"

export default class UpdatePosition {
    @inject("rideRepository")
    rideRepository!: RideRepository;
    @inject("positionRepository")
    positionRepository!: PositionRepository;
    execute = async (input: Input): Promise<void> => {
        const position = Position.create(input.rideId, input.lat, input.long);
        await this.positionRepository.savePosition(position);
        const positions = await this.positionRepository.getPositionsByRideId(input.rideId);
    }
}

type Input = {
    rideId: string,
    lat: number,
    long: number,
}
