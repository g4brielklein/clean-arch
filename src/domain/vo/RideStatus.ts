import { InvalidFieldError } from "../../infra/errors";
import Ride from "../entity/Ride";

export default interface RideStatus {
    value: string;
    request (): void;
    accept (): void;
    start (): void;
    finish(): void;
}

export class RequestedStatus implements RideStatus {
    value: string;

    constructor(readonly ride: Ride) {
        this.value = "requested";
    }

    request(): void {
        throw new InvalidFieldError(`Invalid status`, { errorCode: -9 });
    }

    accept(): void {
        this.ride.setStatus(new AcceptedStatus(this.ride));
    }

    start(): void {
        throw new InvalidFieldError(`Invalid status`, { errorCode: -9 });
    }

    finish(): void {
        throw new InvalidFieldError(`Invalid status`, { errorCode: -9 });
    }
}

export class AcceptedStatus implements RideStatus {
    value: string;

    constructor(readonly ride: Ride) {
        this.value = "accepted"
    }

    request(): void {
        throw new InvalidFieldError(`Invalid status`, { errorCode: -9 });
    }

    accept(): void {
        throw new InvalidFieldError(`Invalid status`, { errorCode: -9 });
    }

    start(): void {
        this.ride.setStatus(new InProgressStatus(this.ride));
    }

    finish(): void {
        throw new InvalidFieldError(`Invalid status`, { errorCode: -9 });
    }
}

export class InProgressStatus implements RideStatus {
    value: string;

    constructor(readonly ride: Ride) {
        this.value = "in_progress";
    }

    request(): void {
        throw new InvalidFieldError(`Invalid status`, { errorCode: -9 });
    }

    accept(): void {
        throw new InvalidFieldError(`Invalid status`, { errorCode: -9 });
    }

    start(): void {
        throw new InvalidFieldError(`Invalid status`, { errorCode: -9 });
    }

    finish(): void {
        this.ride.setStatus(new FinishedStatus(this.ride));
    }
}

export class FinishedStatus implements RideStatus {
    value: string;

    constructor(readonly ride: Ride) {
        this.value = "finished"
    }

    request(): void {
        throw new InvalidFieldError(`Invalid status`, { errorCode: -9 });
    }

    accept(): void {
        throw new InvalidFieldError(`Invalid status`, { errorCode: -9 });
    }

    start(): void {
        throw new InvalidFieldError(`Invalid status`, { errorCode: -9 });
    }

    finish(): void {
        throw new InvalidFieldError(`Invalid status`, { errorCode: -9 });
    }
}

export class RideStatusFactory {
    static create(status: string, ride: Ride) {
        if (status === "requested") return new RequestedStatus(ride);
        if (status === "accepted") return new AcceptedStatus(ride);
        if (status === "in_progress") return new InProgressStatus(ride);
        if (status === "finished") return new FinishedStatus(ride);
        throw new InvalidFieldError(`Invalid status`, { errorCode: -9 });
    }
}
