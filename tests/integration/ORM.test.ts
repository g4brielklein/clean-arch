import UUID from "../../src/domain/vo/UUID";
import DatabaseConnection, { PgPromiseAdapter } from "../../src/infra/database/DatabaseConnection"
import Registry from "../../src/infra/di/Registry";
import ORM, { AccountModel } from "../../src/infra/orm/ORM";

let databaseConnection: DatabaseConnection;

test("Should persist on db using an ORM", async () => {
    databaseConnection = new PgPromiseAdapter();
    Registry.getInstance().provide("databaseConnection", databaseConnection);
    const orm = new ORM();
    Registry.getInstance().provide("orm", orm);
    const accountId = UUID.create().getValue();
    const accountModel = new AccountModel(accountId, "Michael Scott", "mscott@dundermifflin.com", '97456321558', "DunderMifflin1", '', true, false);
    await orm.save(accountModel);
    const account = await orm.get(AccountModel, 'account_id', accountId);
    expect(account.accountId).toBe(accountId);
    expect(account.name).toBe("Michael Scott");
    expect(account.email).toBe("mscott@dundermifflin.com")
})

afterEach(async () => {
    await databaseConnection.close();
})
