import { InventoryModel } from '@/models/inventoryModel'; // Adjust the import path as necessary
import { InventoryItem, InventoryPaginatedResult, Result } from '@/models/types';

export const inventoryService = {
    async addInventoryItem(productData: Omit<InventoryItem, 'id'>): Promise<Result<InventoryItem>> {
        return InventoryModel.create(productData);
    },
    async fetchPaginatedProducts(page: number, pageSize: number, priceCondition?: 'More' | 'Less', priceValue?: number, sortOrder?: 'Asc' | 'Desc', supplierId?: number): Promise<InventoryPaginatedResult<InventoryItem>> {
        return InventoryModel.getAll(page, pageSize, priceCondition, priceValue, sortOrder, supplierId);
    },
    async getProductById(id: number): Promise<Result<InventoryItem>> {
        return InventoryModel.get(id);
    },
    async deleteProduct(id: number) {
        return InventoryModel.delete(id);
    },
    async updateProduct(product: InventoryItem) {
        return InventoryModel.update(product);
    },
    async generateProducts() {
        return InventoryModel.generate();
    },
    async clearInventory() {
        return InventoryModel.deleteAll();
    }
};