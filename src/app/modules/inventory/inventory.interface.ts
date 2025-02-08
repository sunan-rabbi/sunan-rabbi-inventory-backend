export interface IInventory {
    productName: string;
    barcode: string;
    measuringUnit: string;
    buyPrice: number;
    sellPrice: number;
    image?: string;
}

export interface IInventorySearchField {
    searchTerm?: string,
    productName?: string,
    barcode?: string,
    buyPrice?: number,
    sellPrice?: number
}