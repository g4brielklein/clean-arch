import express from "express";
import { InternalServerError } from '../infra/errors'
import { createUser, getUserByAccountId } from './services/signupService';
const PORT = 3000;

const app = express();
app.use(express.json());

app.post("/signup", async (req, res) => {
    const fields = req.body;

    try {
        const userCreated = await createUser(fields);
        res.status(201).json(userCreated);
    } catch(err: any) {
        if (err.errorCode) {
            console.error(err)
            return res.status(err.statusCode).json(err);
        }
        const error = new InternalServerError({ cause: err });
        console.error(error)
        res.status(error.statusCode).json(error);
    }
});

app.get("/accounts/:accountId", async (req, res) => {
    const { accountId } = req.params; 
    
    try {
        const user = await getUserByAccountId(accountId);
        res.status(200).json(user);
    } catch(err: any) {
        if (err.errorCode) {
            console.error(err)
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
