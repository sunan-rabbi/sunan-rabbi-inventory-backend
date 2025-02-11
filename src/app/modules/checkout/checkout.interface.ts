export interface ICheckout {
    shopID: string
    totalPrice: number;
    totalQuantity: number;
}

export interface ICheckoutItem {
    checkoutID: string;
    productID: string;
    productName: string;
    unitPrice: number;
    quantity: number;
}
