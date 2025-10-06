import express from "express";
import { AccountRepositoryDatabase, AccountRepositoryMemory } from './infra/repository/AccountRepository';
import { InternalServerError } from './infra/errors'
import Signup from './application/usecase/Signup';
import GetAccount from './application/usecase/getAccount';
import Registry from "./infra/di/Registry";
const PORT = 3000;

const app = express();
app.use(express.json());

const accountRepository = new AccountRepositoryDatabase();
const getAccount = new GetAccount();
const signup = new Signup();

Registry.getInstance().provide("accountRepository", accountRepository);

app.post("/signup", async (req, res) => {
    const fields = req.body;

    try {
        const output = await signup.execute(fields);
        res.status(201).json(output);
    } catch(err: any) {
        if (err.errorCode) {
            console.error(err);
            return res.status(err.statusCode).json(err);
        }
        const error = new InternalServerError({ cause: err });
        console.error(error);
        res.status(error.statusCode).json(error);
    }
});

app.get("/accounts/:accountId", async (req, res) => {
    const { accountId } = req.params; 
    
    try {
        const output = await getAccount.execute(accountId);
        res.status(200).json(output);
    } catch (err: any) {
        if (err.errorCode) {
            console.error(err);
            return res.status(err.statusCode).json(err);
        }
        const error = new InternalServerError({ cause: err });
        console.error(error);
        res.status(error.statusCode).json(error);
    }
});

app.listen(PORT, () => {
    console.log(`API's running on port ${PORT}`);
});
