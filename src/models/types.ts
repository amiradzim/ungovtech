export interface ResponseData {
    message: string;
}

export interface BoolResponseData extends ResponseData {
    success: boolean;
    error?: string;
}

export interface Result<T> {
    data?: T;
    error?: string;
}

export interface InventoryItem {
    id?: number;
    name: string;
    description?: string;
    price: number;
    supplierId?: number;
}

export interface InventoryResponseData extends ResponseData {
    data?: InventoryItem;
    itemId?: number;
}

export interface InventoryPaginatedResult<T> {
    data: T[];
    total: number;
}

export interface SupplierItem {
    id?: number;
    name: string;
    contactInfo: string;
}

export interface SupplierResponseData extends ResponseData {
    data?: SupplierItem;
    itemId?: number;
}

export interface RegistrationResponseData extends ResponseData {
    success: boolean;
    username?: string;
    id?: number;
}