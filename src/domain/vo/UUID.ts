import { validate } from "uuid";
import { randomUUID } from 'node:crypto';

export default class UUID {
    private value: string;

    constructor (uuid: string) {
        if (!this.validateUUID(uuid)) throw new Error('Invalid UUID')
        this.value = uuid;
    }

    static create () {
        return new UUID(randomUUID());
    }

    validateUUID (uuid: string) {
        return validate(uuid);
    }

    getValue () {
        return this.value;
    }
}