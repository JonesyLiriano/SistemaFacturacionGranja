export class Invoice {
    id?: number;
    customer: number;
    pricePounds: number;
    licensePlate: string;
    paymentMethod: string;
    lotProduct: number;
    date: Date;
    user: number;

    constructor() { }
}
