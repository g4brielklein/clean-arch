import UUID from "../../src/domain/vo/UUID";
import DatabaseConnection, { PgPromiseAdapter } from "../../src/infra/database/DatabaseConnection"
import Registry from "../../src/infra/di/Registry";
import ORM, { AccountModel } from "../../src/infra/orm/ORM";

let orm: ORM;
let databaseConnection: DatabaseConnection;

test("Should persist on db using an ORM", async () => {
    databaseConnection = new PgPromiseAdapter();
    Registry.getInstance().provide("databaseConnection", databaseConnection);
    orm = new ORM();
    Registry.getInstance().provide("orm", orm);

    const inputAccount = {
        accountId: UUID.create().getValue(),
        name: "Michael Scott",
        email: "mscott@dundermifflin.com",
        cpf: "97456321558",
        password: "DunderMifflin1",
        carPlate: "",
        isPassenger: true,
        isDriver: false,
    }
    const accountModel = new AccountModel(
        inputAccount.accountId, 
        inputAccount.name, 
        inputAccount.email, 
        inputAccount.cpf, 
        inputAccount.password, 
        inputAccount.carPlate, 
        inputAccount.isPassenger, 
        inputAccount.isDriver
    );
    await orm.save(accountModel);

    const account = await orm.get(AccountModel, 'account_id', inputAccount.accountId);
    expect(account.accountId).toBe(inputAccount.accountId);
    expect(account.name).toBe(inputAccount.name);
    expect(account.email).toBe(inputAccount.email);
    expect(account.cpf).toBe(inputAccount.cpf);
    expect(account.password).toBe(inputAccount.password);
    expect(account.carPlate).toBe(inputAccount.carPlate);
    expect(account.isPassenger).toBe(inputAccount.isPassenger);
    expect(account.isDriver).toBe(inputAccount.isDriver);
})

afterEach(async () => {
    await databaseConnection.close();
})
