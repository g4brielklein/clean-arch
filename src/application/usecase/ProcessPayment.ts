import { inject } from "../../infra/di/Registry";
import { ResourceNotFoundError } from "../../infra/errors";
import { PaymentProcessorFactory } from "../../infra/fallback/PaymentProcessor";
import RideRepository from "../../infra/repository/RideRepository";

export default class ProcessPayment {
    @inject("rideRepository")
    rideRepository!: RideRepository;

    async execute(rideId: string): Promise<void> {
        const ride = await this.rideRepository.getRideById(rideId);
        if (!ride) throw new ResourceNotFoundError(`Ride with id ${rideId} not found`, { errorCode: -8 });
        // const gateway = new CieloPaymentGateway();
        // const gateway = new PJBankPaymentGateway();
        const processor = PaymentProcessorFactory.create();
        const input = {
            creditCardToken: "",
            amount: ride.getFare(),
        }
        const output = await processor.processPayment(input);
    }
}
