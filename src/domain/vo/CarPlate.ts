import { InvalidFieldError } from "../../infra/errors";

export default class CarPlate {
    private value: string;

    constructor (carPlate: string) {
        if (!this.validateCarPlate(carPlate)) throw new InvalidFieldError("Invalid car plate", { errorCode: -6 });
        this.value = carPlate;
    }

    getValue () {
        return this.value;
    }

    validateCarPlate (carPlate: string) {
        return carPlate?.match(/[A-Z]{3}[0-9]{4}/) || carPlate?.match(/[A-Z]{3}[0-9]{1}[A-Z]{1}[0-9]{2}/);
    }
}
