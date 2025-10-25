import AcceptRide from "../../application/usecase/AcceptRide";
import GetRide from "../../application/usecase/GetRide";
import RequestRide from "../../application/usecase/RequestRide";
import StartRide from "../../application/usecase/StartRide";
import { inject } from "../di/Registry";
import HttpServer from "../http/HttpServer";

export default class RideController {
    @inject("httpServer")
    httpServer!: HttpServer;
    @inject("requestRide")
    requestRide!: RequestRide;
    @inject("acceptRide")
    acceptRide!: AcceptRide;
    @inject("startRide")
    startRide!: StartRide;
    @inject("getRide")
    getRide!: GetRide;

    constructor () {
        this.httpServer.register("post", "/rides", async (params: any, body: any) => {
            const { passengerId, fromLat, fromLong, toLat, toLong } = body;
            const input = {
                passengerId,
                fromLat,
                fromLong,
                toLat,
                toLong,
            }
            const output = await this.requestRide.execute(input);
            return output;
        })

        this.httpServer.register("put", "/rides/:{rideId}/accept", async (params: any, body: any) => {
            const { rideId } = params;
            const { driverId } = body;
            const input = {
                rideId,
                driverId,
            }
            const output = await this.acceptRide.execute(input);
            return output;
        });

        this.httpServer.register("put", "/rides/:{rideId}/start", async (params: any, body: any) => {
            const { rideId } = params;
            const input = {
                rideId,
            }
            const output = await this.startRide.execute(input);
            return output;
        });

        this.httpServer.register("get", "/rides/:{rideId}", async (params: any, body: any) => {
            const { rideId } = params;
            const output = await this.getRide.execute(rideId);
            return output;
        })
    }
}
