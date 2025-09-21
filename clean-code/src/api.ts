import express from "express";
import { AccountDAODatabase } from './data';
import { InternalServerError } from '../infra/errors'
import Signup from './signup';
import GetAccount from './getAccount';
const PORT = 3000;

const app = express();
app.use(express.json());

const accountDAO = new AccountDAODatabase();
const getAccount = new GetAccount(accountDAO);
const signup = new Signup(accountDAO);

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
