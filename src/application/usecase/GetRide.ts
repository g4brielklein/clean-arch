import { inject } from "../../infra/di/Registry";
import RideRepository from "../../infra/repository/RideRepository";

export default class GetRide {
    @inject("rideRepository")
    rideRepository!: RideRepository;

    execute = async (rideId: string): Promise<Output> => {
        const ride = await this.rideRepository.getRideById(rideId);
        return {
            rideId: ride.getRideId(),
            passengerId: ride.getPassengerId(),
            driverId: ride.getDriverId(),
            fromLat: ride.fromLat,
            fromLong: ride.fromLong,
            toLat: ride.toLat,
            toLong: ride.toLong,
            fare: ride.getFare(),
            distance: ride.getDistance(),
            status: ride.getStatus(),
            date: ride.date,
        };
    }
}

type Output = {
    rideId: string,
    passengerId: string,
    driverId?: string,
    fromLat: number,
    fromLong: number,
    toLat: number,
    toLong: number,
    fare: number,
    distance: number,
    status: string,
    date: Date,
};
