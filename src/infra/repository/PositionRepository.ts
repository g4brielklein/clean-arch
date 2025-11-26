import Position from "../../domain/entity/Position";
import DatabaseConnection from "../database/DatabaseConnection";
import { inject } from "../di/Registry";

// Interface Adapter
export default interface PositionRepository {
    savePosition (position: Position): Promise<void>;
    getPositionsByRideId (rideId: string): Promise<Position[]>;
    getLastPositionByRideId (rideId: string): Promise<Position | undefined>;
}

export class PositionRepositoryDatabase implements PositionRepository {
    @inject("databaseConnection")
    connection!: DatabaseConnection;

    async savePosition(position: Position): Promise<void> {
        await this.connection.query({
            query: "INSERT INTO ccca.positions (position_id, ride_id, lat, long, date) VALUES ($1, $2, $3, $4, $5)",
            values: [position.getPositionId(), position.getRideId(), position.getCoord().getLat(), position.getCoord().getLong(), position.getDate()],
        });
    }

    async getPositionsByRideId(rideId: string): Promise<Position[]> {
        const positionsData = await this.connection.query({
            query: "SELECT * FROM ccca.positions WHERE ride_id = $1;",
            values: [rideId],
        });
        
        const positions: any = [];
        for (const positionData of positionsData) {
            positions.push(new Position(positionData.position_id, positionData.ride_id, parseFloat(positionData.lat), parseFloat(positionData.long), positionData.date));
        }
        return positions;
    }

    async getLastPositionByRideId(rideId: string): Promise<Position | undefined> {
        const [lastPositionData] = await this.connection.query({
            query: "SELECT * FROM ccca.positions WHERE ride_id = $1 ORDER BY date DESC LIMIT 1;",
            values: [rideId],
        });
        if (!lastPositionData) return;
        const position = new Position(lastPositionData.position_id, lastPositionData.ride_id, lastPositionData.lat, lastPositionData.long, lastPositionData.date);
        return position;
    }
}
