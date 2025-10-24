export default class Coord {
    private lat: number;
    private long: number;

    constructor (lat: number, long: number) {
        if (!this.validateLatitude(lat)) throw new Error("Invalid latitude");
        if (!this.validateLongitude(long)) throw new Error("Invalid longitude");
        this.lat = lat;
        this.long = long;
    }

    validateLatitude (lat: number): boolean {
        return lat >= -90 && lat <= 90
    }

    validateLongitude (long: number): boolean {
        return long >= -180 && long <= 180
    }

    getLat () {
        return this.lat;
    }
    
    getLong () {
        return this.long;
    }
}
