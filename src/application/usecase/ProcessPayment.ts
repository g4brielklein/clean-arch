import { inject } from "../../infra/di/Registry";
import { InvalidFieldError, ResourceNotFoundError } from "../../infra/errors";
import { CieloPaymentGateway } from "../../infra/gateway/PaymentGateway";
import RideRepository from "../../infra/repository/RideRepository";

export default class ProcessPayment {
    @inject("rideRepository")
    rideRepository!: RideRepository;

    async execute(rideId: string): Promise<void> {
        const ride = await this.rideRepository.getRideById(rideId);
        if (!ride) throw new ResourceNotFoundError(`Ride with id ${rideId} not found`, { errorCode: -8 });
        const gateway = new CieloPaymentGateway();
        const input = {
            creditCardToken: "",
            amount: ride.getFare(),
        }
        await gateway.processTransaction(input);
    }
}
