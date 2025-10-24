import AcceptRide from "../../src/application/usecase/AcceptRide";
import GetRide from "../../src/application/usecase/GetRide";
import RequestRide from "../../src/application/usecase/RequestRide";
import Signup from "../../src/application/usecase/Signup";
import DatabaseConnection, { PgPromiseAdapter } from "../../src/infra/database/DatabaseConnection";
import Registry from "../../src/infra/di/Registry";
import AccountRepository, { AccountRepositoryDatabase } from "../../src/infra/repository/AccountRepository";
import PositionRepository, { PositionRepositoryDatabase } from "../../src/infra/repository/PositionRepository";
import { RideRepositoryDatabase } from "../../src/infra/repository/RideRepository";

let databaseConnection: DatabaseConnection;
let accountRepository: AccountRepository;
let rideRepository: RideRepositoryDatabase;
let positionRepository: PositionRepository;
let signup: Signup;
let requestRide: RequestRide;
let getRide: GetRide;
let acceptRide: AcceptRide;

beforeEach(() => {
    databaseConnection = new PgPromiseAdapter();
    Registry.getInstance().provide("databaseConnection", databaseConnection);
    accountRepository = new AccountRepositoryDatabase();
    Registry.getInstance().provide("accountRepository", accountRepository);
    rideRepository = new RideRepositoryDatabase();
    Registry.getInstance().provide("rideRepository", rideRepository);
    positionRepository = new PositionRepositoryDatabase();
    Registry.getInstance().provide("positionRepository", positionRepository);
    signup = new Signup();
    requestRide = new RequestRide();
    getRide = new GetRide();
    acceptRide = new AcceptRide();
})

test("Should accept a ride", async () => {
    const inputSignupPassenger = {
        name: 'John Doe',
        email: `johndoe${Math.random()}@gmail.com`,
        cpf: '97456321558',
        password: 'Abcd1234',
        isPassenger: true,
        isDriver: false,
    };

    const outputSignupPassenger = await signup.execute(inputSignupPassenger);
    expect(outputSignupPassenger.accountId).toBeDefined();

    const inputSignupDriver = {
        name: 'John Doe',
        email: `johndoe${Math.random()}@gmail.com`,
        cpf: '97456321558',
        password: 'Abcd1234',
        isPassenger: false,
        isDriver: true,
        carPlate: 'IOG5C77'
    };
    const outputSignupDriver = await signup.execute(inputSignupDriver);
    expect(outputSignupDriver.accountId).toBeDefined();

    const inputRequestRide = {
        passengerId: outputSignupPassenger.accountId,
        fromLat: -27.584905257808835,
        fromLong: -48.545022195325124,
        toLat: -27.496887588317275,
        toLong: -48.522234807851476,
    };

    const outputRequestRide = await requestRide.execute(inputRequestRide);
    expect(outputRequestRide.rideId).toBeDefined();

    const inputAcceptRide = {
        rideId: outputRequestRide.rideId,
        driverId: outputSignupDriver.accountId,
    }
    await acceptRide.execute(inputAcceptRide);

    const acceptedRideOutput = await getRide.execute(outputRequestRide.rideId);
    expect(acceptedRideOutput.status).toBe("accepted");
    expect(acceptedRideOutput.driverId).toBe(outputSignupDriver.accountId);
})

test("Should not accept a ride if accepter is not a driver", async () => {
    const inputSignupPassenger = {
        name: 'John Doe',
        email: `johndoe${Math.random()}@gmail.com`,
        cpf: '97456321558',
        password: 'Abcd1234',
        isPassenger: true,
        isDriver: false,
    };

    const outputSignupPassenger = await signup.execute(inputSignupPassenger);
    expect(outputSignupPassenger.accountId).toBeDefined();

    const inputRequestRide = {
        passengerId: outputSignupPassenger.accountId,
        fromLat: -27.584905257808835,
        fromLong: -48.545022195325124,
        toLat: -27.496887588317275,
        toLong: -48.522234807851476,
    }

    const outputRequestRide = await requestRide.execute(inputRequestRide);
    expect(outputRequestRide.rideId).toBeDefined();

    const inputAcceptRide = {
        rideId: outputRequestRide.rideId,
        driverId: outputSignupPassenger.accountId,
    }
    await expect(() => acceptRide.execute(inputAcceptRide)).rejects.toThrow(new Error('Ride accepter must be a driver'))

    const acceptedRideOutput = await getRide.execute(outputRequestRide.rideId);
    expect(acceptedRideOutput.status).toBe("requested");
})

afterEach(async () => {
    await databaseConnection.close();
})
