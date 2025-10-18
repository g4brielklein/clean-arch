import { InvalidFieldError } from "../../infra/errors";

export default class Name {
    private value: string;

    constructor (name: string) {
        if (!this.validateName(name)) throw new InvalidFieldError("Invalid name", { errorCode: -3 });
        this.value = name;
    }

    validateName (name: string) {
        return name?.match(/[a-zA-Z] [a-zA-Z]+/);
    }

    getValue () {
        return this.value;
    }
}
