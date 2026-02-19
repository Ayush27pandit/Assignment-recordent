export interface User {
    id?: number;
    name: string;
    email: string;
    mobile: string;
    password?: string;
    created_at?: Date;
}

export interface Buyer {
    id?: number;
    user_id: number;
    name: string;
    email: string;
    mobile: string;
    address?: string;
    total_invoice: number;
    amount_paid: number;
    amount_due: number;
    created_at?: Date;
}
