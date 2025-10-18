import AcceptRide from "../../src/application/usecase/AcceptRide";
import GetRide from "../../src/application/usecase/GetRide";
import RequestRide from "../../src/application/usecase/RequestRide";
import Signup from "../../src/application/usecase/Signup";
import StartRide from "../../src/application/usecase/StartRide";
import DatabaseConnection, { PgPromiseAdapter } from "../../src/infra/database/DatabaseConnection";
import Registry from "../../src/infra/di/Registry";
import AccountRepository, { AccountRepositoryDatabase } from "../../src/infra/repository/AccountRepository";
import RideRepository, { RideRepositoryDatabase } from "../../src/infra/repository/RideRepository";

let databaseConnection: DatabaseConnection;
let accountRepository: AccountRepository;
let rideRepository: RideRepository
let signup: Signup;
let requestRide: RequestRide;
let getRide: GetRide;
let acceptRide: AcceptRide;
let startRide: StartRide;

beforeEach(() => {
    databaseConnection = new PgPromiseAdapter();
    Registry.getInstance().provide("databaseConnection", databaseConnection);
    accountRepository = new AccountRepositoryDatabase();
    Registry.getInstance().provide("accountRepository", accountRepository);
    rideRepository = new RideRepositoryDatabase();
    Registry.getInstance().provide("rideRepository", rideRepository);
    signup = new Signup();
    requestRide = new RequestRide();
    getRide = new GetRide();
    acceptRide = new AcceptRide();
    startRide = new StartRide();
})

test("Should start a ride", async () => {
    const inputSignupPassenger = {
        name: 'John Doe',
        email: `johndoe${Math.random()}@gmail.com`,
        cpf: '97456321558',
        password: 'Abcd1234',
        isPassenger: true,
        isDriver: false,
    };
    const outputSignupPassenger = await signup.execute(inputSignupPassenger);

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

    const inputRequestRide = {
        passengerId: outputSignupPassenger.accountId,
        fromLat: -27.584905257808835,
        fromLong: -48.545022195325124,
        toLat: -27.496887588317275,
        toLong: -48.522234807851476,
    };
    const outputRequestRide = await requestRide.execute(inputRequestRide);

    const inputAcceptRide = {
        rideId: outputRequestRide.rideId,
        driverId: outputSignupDriver.accountId,
    }
    await acceptRide.execute(inputAcceptRide);

    const inputStartRide = {
        rideId: outputRequestRide.rideId,
    }
    await startRide.execute(inputStartRide);

    const outputGetRide = await getRide.execute(outputRequestRide.rideId);
    expect(outputGetRide.status).toBe("in_progress");
});

afterEach(async () => {
    await databaseConnection.close();
});
