import { randomUUID } from 'node:crypto';

export default class Ride {
    private driverId?: string;

    constructor (
        readonly rideId: string,
        readonly passengerId: string,
        driverId: string | null,
        readonly fromLat: number,
        readonly fromLong: number,
        readonly toLat: number,
        readonly toLong: number,
        private fare: number,
        private distance: number,
        private status: string,
        readonly date: Date
    ) {
        if (fromLat < -90 || fromLat > 90 || toLat < -90 || toLat > 90) throw new Error("Invalid latitude");
        if (fromLong < -180 || fromLong > 180 || toLong < -180 || toLong > 180) throw new Error("Invalid latitude");
        if (driverId) this.setDriverId(driverId);
    }

    static create (
        passengerId: string,
        fromLat: number,
        fromLong: number,
        toLat: number,
        toLong: number
    ) {
        const rideId = randomUUID();
        const status = "requested";
        const date = new Date();
        const fare = 0;
        const distance = 0;
        return new Ride(rideId, passengerId, null, fromLat, fromLong, toLat, toLong, fare, distance, status, date);
    }

    calculateDistance () {
        const earthRadius = 6371;
        const degreesToRadians = Math.PI / 180;
        const deltaLat = (this.toLat - this.fromLat) * degreesToRadians;
        const deltaLong = (this.toLong - this.fromLong) * degreesToRadians;
        const a = 
            Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) + 
            Math.cos(this.fromLat * degreesToRadians) * 
            Math.cos(this.toLat * degreesToRadians) * 
            Math.sin(deltaLong / 2) * 
            Math.sin(deltaLong / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = earthRadius * c;
        return Math.round(distance);
    }

    calculateFare () {
        const distance = this.calculateDistance();
        return distance * 2.1;
    }

    setDriverId (driverId: string) {
        this.driverId = driverId;
    }

    getDriverId () {
        return this.driverId;
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

    setStatus (status: string) {
        this.status = status;
    }

    getStatus () {
        return this.status;
    }

    accept (driverId: string) {
        this.setStatus('accepted');
        this.setDriverId(driverId);
    }
}
