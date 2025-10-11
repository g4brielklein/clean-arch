import { AccountRepositoryDatabase, AccountRepositoryMemory } from "./infra/repository/AccountRepository";
import AccountController from "./infra/controller/AccountController";
import { ExpressAdapter } from "./infra/http/HttpServer";
import { PgPromiseAdapter } from "./infra/database/DatabaseConnection";
import Registry from "./infra/di/Registry";
import Signup from "./application/usecase/Signup";
import GetAccount from "./application/usecase/GetAccount";
const PORT = 3000;

// Main - Composition Root
const databaseConnection = new PgPromiseAdapter();
const accountRepository = new AccountRepositoryDatabase();
// const accountRepository = new AccountRepositoryMemory();
const signup = new Signup();
const getAccount = new GetAccount();
const httpServer = new ExpressAdapter();
// const httpServer = new HapiAdapter();
Registry.getInstance().provide("databaseConnection", databaseConnection);
Registry.getInstance().provide("httpServer", httpServer);
Registry.getInstance().provide("accountRepository", accountRepository);
Registry.getInstance().provide("signup", signup);
Registry.getInstance().provide("getAccount", getAccount);
new AccountController
httpServer.listen(PORT);
