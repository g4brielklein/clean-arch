import Ride from "../../src/domain/Ride";
import UUID from "../../src/domain/vo/UUID";

test("Should test an ride", () => {
    const fromLat = -27.584905257808835;
    const fromLong = -48.545022195325124;
    const toLat = -27.496887588317275;
    const toLong = -48.522234807851476;
    const ride = Ride.create(UUID.create().getValue(), fromLat, fromLong, toLat, toLong);
    expect(ride.getFrom().getLat()).toBe(fromLat);
    expect(ride.getFrom().getLong()).toBe(fromLong);
    expect(ride.getTo().getLat()).toBe(toLat);
    expect(ride.getTo().getLong()).toBe(toLong);
})
