import {InventoryItem, Result, SupplierItem} from '@/models/types';
import { SupplierModel } from "@/models/supplierModel";
import {InventoryModel} from "@/models/inventoryModel";

export const supplierService = {
    async addSupplier(supplierData: Omit<SupplierItem, 'id'>): Promise<Result<SupplierItem>> {
        return SupplierModel.create(supplierData);
    },
    async updateSupplier(supplier: SupplierItem) {
        return SupplierModel.update(supplier);
    },
    async deleteSupplier(id: number) {
        return SupplierModel.delete(id);
    },
    async generateSupplier() {
        return SupplierModel.generate();
    },
    async clearSupplier() {
        return SupplierModel.deleteAll();
    }
};