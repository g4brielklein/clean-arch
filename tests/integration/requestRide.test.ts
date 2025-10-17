import GetRide from "../../src/application/usecase/GetRide";
import RequestRide from "../../src/application/usecase/RequestRide";
import Signup from "../../src/application/usecase/Signup";
import DatabaseConnection, { PgPromiseAdapter } from "../../src/infra/database/DatabaseConnection";
import Registry from "../../src/infra/di/Registry";
import { AccountRepositoryDatabase } from "../../src/infra/repository/AccountRepository";
import { RideRepositoryDatabase } from "../../src/infra/repository/RideRepository";

let databaseConnection: DatabaseConnection;
let signup: Signup;
let requestRide: RequestRide;
let getRide: GetRide;

beforeEach(() => {
    databaseConnection = new PgPromiseAdapter();
    Registry.getInstance().provide("databaseConnection", databaseConnection);
    const accountRepository = new AccountRepositoryDatabase();
    const rideRepository = new RideRepositoryDatabase();
    Registry.getInstance().provide("accountRepository", accountRepository);
    Registry.getInstance().provide("rideRepository", rideRepository);
    signup = new Signup();
    requestRide = new RequestRide();
    getRide = new GetRide();
});

test("Should request a ride", async () => {
    const inputSignup = {
        name: 'John Doe',
        email: `johndoe${Math.random()}@gmail.com`,
        cpf: '97456321558',
        password: 'Abcd1234',
        isPassenger: true,
    }

    const outputSignup = await signup.execute(inputSignup);

    const inputRequestRide = {
        passengerId: outputSignup.accountId,
        fromLat: -27.584905257808835,
        fromLong: -48.545022195325124,
        toLat: -27.496887588317275,
        toLong: -48.522234807851476,
    }

    const outputRequestRide = await requestRide.execute(inputRequestRide);
    expect(outputRequestRide.rideId).toBeDefined();
    const outputGetRide = await getRide.execute(outputRequestRide.rideId);
    expect(outputGetRide.passengerId).toBe(inputRequestRide.passengerId);
    expect(outputGetRide.fromLat).toBe(inputRequestRide.fromLat);
    expect(outputGetRide.fromLong).toBe(inputRequestRide.fromLong);
    expect(outputGetRide.toLat).toBe(inputRequestRide.toLat);
    expect(outputGetRide.toLong).toBe(inputRequestRide.toLong);
    // expect(outputGetRide.fare).toBe(21);
    // expect(outputGetRide.distance).toBe(10);
    expect(outputGetRide.status).toBe("requested");
})

test("Should not request a ride if requester is not a passenger", async () => {
    const inputSignup = {
        name: 'John Doe',
        email: `johndoe${Math.random()}@gmail.com`,
        cpf: '97456321558',
        password: 'Abcd1234',
        isPassenger: false,
        isDriver: true,
        carPlate: 'IOG5C00',
    };

    const outputSignup = await signup.execute(inputSignup);

    const inputRequestRide = {
        passengerId: outputSignup.accountId,
        fromLat: -27.584905257808835,
        fromLong: -48.545022195325124,
        toLat: -27.496887588317275,
        toLong: -48.522234807851476,
    };

    await expect(() => requestRide.execute(inputRequestRide)).rejects.toThrow(new Error("Requester must be a passenger"));
})

test("Should not request a ride if passenger already has an active one", async () => {
    const inputSignup = {
        name: 'John Doe',
        email: `johndoe${Math.random()}@gmail.com`,
        cpf: '97456321558',
        password: 'Abcd1234',
        isPassenger: true,
    };

    const outputSignup = await signup.execute(inputSignup);

    const inputRequestRide = {
        passengerId: outputSignup.accountId,
        fromLat: -27.584905257808835,
        fromLong: -48.545022195325124,
        toLat: -27.496887588317275,
        toLong: -48.522234807851476,
    };

    const outputRequestRide = await requestRide.execute(inputRequestRide);
    expect(outputRequestRide.rideId).toBeDefined();

    await expect(() => requestRide.execute(inputRequestRide)).rejects.toThrow(new Error("Requester already has an active ride"));
})

test("Should not request a ride if either longitude or latitude is invalid", async () => {
    const inputSignup = {
        name: 'John Doe',
        email: `johndoe${Math.random()}@gmail.com`,
        cpf: '97456321558',
        password: 'Abcd1234',
        isPassenger: true,
    };

    const outputSignup = await signup.execute(inputSignup);

    const inputRequestRide = {
        passengerId: outputSignup.accountId,
        fromLat: -91.584905257808835,
        fromLong: -48.545022195325124,
        toLat: -27.496887588317275,
        toLong: -48.522234807851476,
    };

    await expect(() => requestRide.execute(inputRequestRide)).rejects.toThrow(new Error("Invalid latitude"));
})

afterEach(async () => {
    await databaseConnection.close()
})
