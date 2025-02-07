export interface IAdmin {
    password: string;
    admin: {
        name: string;
        number: string;
        image?: string;
    }
}

export interface ICustomer {
    password: string;
    customer: {
        name: string;
        number: string;
        image?: string;
    }
}