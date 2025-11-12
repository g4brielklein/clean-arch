import RideStatus, { RideStatusFactory } from './RideStatus';
import Coord from './vo/Coord';
import UUID from './vo/UUID';

export default class Ride {
    private rideId: UUID;
    private passengerId: UUID;
    private driverId?: UUID;
    private from: Coord;
    private to: Coord;
    private status: RideStatus;

    constructor (
        rideId: string,
        passengerId: string,
        driverId: string | null,
        fromLat: number,
        fromLong: number,
        toLat: number,
        toLong: number,
        private fare: number,
        private distance: number,
        status: string,
        readonly date: Date
    ) {
        this.rideId = new UUID(rideId);
        this.passengerId = new UUID(passengerId);
        if (driverId) this.driverId = new UUID(driverId);
        this.from = new Coord(fromLat, fromLong);
        this.to = new Coord(toLat, toLong);
        this.status = RideStatusFactory.create(status, this);
    }

    // Static factory method
    static create (
        passengerId: string,
        fromLat: number,
        fromLong: number,
        toLat: number,
        toLong: number
    ) {
        const rideId = UUID.create().getValue();
        const status = "requested";
        const date = new Date();
        const fare = 0;
        const distance = 0;
        return new Ride(rideId, passengerId, null, fromLat, fromLong, toLat, toLong, fare, distance, status, date);
    }

    getRideId () {
        return this.rideId.getValue();
    }

    getPassengerId () {
        return this.passengerId.getValue();
    }

    setDriverId (driverId: string) {
        this.driverId = new UUID(driverId);
    }

    getDriverId () {
        return this.driverId?.getValue();
    }

    getFrom () {
        return this.from;
    }

    getTo() {
        return this.to;
    }

    setFare (fare: number) {
        this.fare = fare;
    };

    getFare () {
        return this.fare;
    }

    setDistance (distance: number) {
        this.distance = distance;
    }

    getDistance () {
        return this.distance;
    }

    setStatus (status: RideStatus) {
        this.status = status;
    }

    getStatus () {
        return this.status.value;
    }

    accept (driverId: string) {
        this.status.accept();
        this.setDriverId(driverId);
    }

    start () {
        this.status.start();
    }

    finish() {
        this.status.finish();
    }
}
