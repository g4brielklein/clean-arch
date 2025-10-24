import Ride from "../../domain/Ride";
import { inject } from "../di/Registry";
import DatabaseConnection from "../database/DatabaseConnection";

// Interface Adapter
export default interface RideRepository {
    saveRide (ride: Ride): Promise<void>;
    getRideById (rideId: string): Promise<Ride | undefined>;
    hasActiveRideByPassengerId (passengerId: string): Promise<boolean>;
    updateRide(ride: Ride): Promise<void>;
    updateRideStatus(ride: Ride): Promise<void>;
}

export class RideRepositoryDatabase implements RideRepository {
    @inject("databaseConnection")
    connection!: DatabaseConnection;

    async saveRide(ride: Ride): Promise<void> {
        await this.connection.query({
            query: 'INSERT INTO ccca.rides (ride_id, passenger_id, driver_id, from_lat, from_long, to_lat, to_long, fare, distance, status, date) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11);',
            values: [ride.getRideId(), ride.getPassengerId(), ride.getDriverId(), ride.getFrom().getLat(), ride.getFrom().getLong(), ride.getTo().getLat(), ride.getTo().getLong(), ride.getFare(), ride.getDistance(), ride.getStatus(), ride.date],
        });
    };

    async getRideById(rideId: string): Promise<Ride | undefined> {
        const [rideData] = await this.connection.query({
            query: 'SELECT * FROM ccca.rides WHERE ride_id = $1;',
            values: [rideId],
        });
        if (!rideData) return;

        return new Ride(rideData.ride_id, rideData.passenger_id, rideData.driver_id, parseFloat(rideData.from_lat), parseFloat(rideData.from_long), parseFloat(rideData.to_lat), parseFloat(rideData.to_long), parseFloat(rideData.fare), parseFloat(rideData.distance), rideData.status, rideData.date);
    };

    async hasActiveRideByPassengerId(passengerId: string): Promise<boolean> {
        const [rideData] = await this.connection.query({
            query: "SELECT ride_id FROM ccca.rides WHERE passenger_id = $1 AND status IN ('requested', 'accepted', 'in_progress');",
            values: [passengerId],
        });

        return !!rideData;
    };

    async updateRide(ride: Ride): Promise<void> {
        await this.connection.query({
            query: "UPDATE ccca.rides SET status = $1, driver_id = $2, distance = $3, fare = $4 WHERE ride_id = $5;",
            values: [ride.getStatus(), ride.getDriverId(), ride.getDistance(), ride.getFare(), ride.getRideId()],
        });
    }

    async updateRideStatus(ride: Ride): Promise<void> {
        await this.connection.query({
            query: "UPDATE ccca.rides SET status = $1 WHERE ride_id = $2;",
            values: [ride.getStatus(), ride.getRideId()],
        });
    }
}
