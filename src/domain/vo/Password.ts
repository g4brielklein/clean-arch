import { InvalidFieldError } from "../../infra/errors";

export default class Password {
    private value: string;

    constructor (password: string) {
        if (!this.validatePassword(password)) throw new InvalidFieldError("Invalid password", { errorCode: -5 });
        this.value = password;
    }

    validatePassword(password: string) {
        return password?.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/);
    }

    getValue () {
        return this.value;
    }
}
