import GetAccount from "./application/usecase/getAccount";
import Signup from "./application/usecase/Signup";
import Registry from "./infra/di/Registry";
import { AccountRepositoryDatabase, AccountRepositoryMemory } from "./infra/repository/AccountRepository";

// Main - Composition root
const accountRepository = new AccountRepositoryDatabase();
// const accountRepository = new AccountRepositoryMemory();

const signup = new Signup();
const getAccount = new GetAccount();

Registry.getInstance().provide("accountRepository", accountRepository);
Registry.getInstance().provide("signup", signup);
Registry.getInstance().provide("getAccount", getAccount);
