import { inject } from "../di/Registry";
import HttpServer from "../http/HttpServer";
import Signup from "../../application/usecase/Signup";
import GetAccount from "../../application/usecase/GetAccount";

// Interface Adapter
export default class AccountController {
    @inject("httpServer")
    httpServer!: HttpServer;
    @inject("signup")
    signup!: Signup;
    @inject("getAccount")
    getAccount!: GetAccount;

    constructor () {
        this.httpServer.register("post", "/signup", async (params: any, body: any) => {
            const fields = body;
            const output = this.signup.execute(fields);
            return output;
        })

        this.httpServer.register("get", "/accounts/:{accountId}", async (params: any, body: any) => {
            const { accountId } = params; 
            const output = await this.getAccount.execute(accountId);
            return output;
        })
    }
}
