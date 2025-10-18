import { InvalidFieldError } from "../../infra/errors";

export default class Email {
    private value: string;

    constructor (email: string) {
        if (!this.validateEmail(email)) throw new InvalidFieldError("Invalid email", { errorCode: -2 });
        this.value = email;
    }

    validateEmail (email: string) {
        return email?.match(/^(.+)@(.+)$/);
    }

    getValue () {
        return this.value;
    }
}
