import Ride from "../../src/domain/Ride";
import UUID from "../../src/domain/vo/UUID";

test("Should test an ride", () => {
    const inputRide = {
        fromLat: -27.584905257808835,
        fromLong: -48.545022195325124,
        toLat: -27.496887588317275,
        toLong: -48.522234807851476,
    }
    const ride = Ride.create(UUID.create().getValue(), inputRide.fromLat, inputRide.fromLong, inputRide.toLat, inputRide.toLong);
    
    expect(ride.getFrom().getLat()).toBe(inputRide.fromLat);
    expect(ride.getFrom().getLong()).toBe(inputRide.fromLong);
    expect(ride.getTo().getLat()).toBe(inputRide.toLat);
    expect(ride.getTo().getLong()).toBe(inputRide.toLong);
})
