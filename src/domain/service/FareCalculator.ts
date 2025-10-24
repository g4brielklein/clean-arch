// Domain Service
export default class FareCalculator {
    private static FARE_RATE = 2.1;

    static calculate = (distance: number) => {
        return distance * FareCalculator.FARE_RATE;
    }
}
