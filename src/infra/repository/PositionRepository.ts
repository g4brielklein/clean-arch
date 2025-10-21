import Position from "../../domain/Position";
import DatabaseConnection from "../database/DatabaseConnection";
import { inject } from "../di/Registry";

export default interface PositionRepository {
    savePosition (position: Position): Promise<void>;
    // getPositionById (positionId: UUID): Promise<Position>;
    getPositionsByRideId (rideId: string): Promise<Position[]>; 
}

export class PositionRepositoryDatabase implements PositionRepository {
    @inject("databaseConnection")
    connection!: DatabaseConnection;

    async savePosition(position: Position): Promise<void> {
        await this.connection.query({
            query: "INSERT INTO ccca.positions (position_id, ride_id, lat, long) VALUES ($1, $2, $3, $4)",
            values: [position.getPositionId(), position.getRideId(), position.getCoord().getLat(), position.getCoord().getLong()],
        });
    }

    async getPositionsByRideId(rideId: string): Promise<Position[]> {
        const positionsData = await this.connection.query({
            query: "SELECT * FROM ccca.positions WHERE ride_id = $1;",
            values: [rideId],
        });
        
        const positions: any = [];
        for (const positionData of positionsData) {
            positions.push(new Position(positionData.position_id, positionData.ride_id, positionData.lat, positionData.long));
        }
        return positions;
    }
}
