import supabase from '@/db/supabase';
import {SupplierItem, Result, BoolResponseData, AllSupplierItems} from "@/models/types";

export const SupplierModel = {
    // get all suppliers
    async getAll(): Promise<AllSupplierItems<SupplierItem>> {
        let { data: suppliers, error } = await supabase
            .from("supplier")
            .select("*");

        if (error) {
            throw new Error(`Failed to fetch suppliers: ${error.message}`);
        }

        const supplierItems: SupplierItem[] = suppliers || [];

        return { data: supplierItems };
    },

    // create new supplier
    async create(supplier: SupplierItem): Promise<Result<SupplierItem>> {
        const { name, contactinfo } = supplier;

        if (!name || !contactinfo) {
            throw new Error("Required fields cannot be empty.");
        }

        let { data, error } = await supabase
            .from("supplier")
            .insert([
                { name, contactinfo }
            ])
            .select()
            .single();

        if (error) {
            return { error: `Failed to insert supplier: ${error.message}` };
        }

        if (data) {
            const insertedSupplier = data as SupplierItem;
            return { data: insertedSupplier };
        } else {
            return { error: "Failed to insert supplier." };
        }
    },

    // update supplier
    async update(supplier: SupplierItem): Promise<BoolResponseData> {
        const { id, name, contactinfo } = supplier;

        let { data, error } = await supabase
            .from("supplier")
            .update({ name, contactinfo })
            .eq("id", id);

        if (error) {
            return { success: false, message: `Failed to update supplier: ${error.message}` };
        }

        return { success: true, message: "Supplier updated successfully." };
    },

    // delete supplier
    async delete(id: number): Promise<BoolResponseData> {
        let { data, error } = await supabase
            .from("supplier")
            .delete()
            .eq("id", id);

        if (error) {
            return { success: false, message: `Failed to delete the supplier: ${error.message}` };
        }

        return { success: true, message: "Supplier deleted successfully." };
    },

    // generate 10 random suppliers
    async generate(): Promise<BoolResponseData> {
        let suppliersCreated = 0;

        for (let i = 0; i < 10; i++) {
            const supplier = {
                name: `Supplier ${i + 1}`,
                contactinfo: `Email: supplier${i + 1}@example.com`
            };

            const result = await this.create(supplier);

            if (result.data) {
                suppliersCreated++;
            }
        }

        return { success: true, message: `${suppliersCreated} random suppliers created successfully.` };
    },

    // delete everything in supplier table
    async deleteAll(): Promise<BoolResponseData> {
        try {
            let { error } = await supabase
                .from("supplier")
                .delete()
                .gte("id", 0);

            if (error) {
                return { success: false, message: `Failed to delete all suppliers: ${error.message}` };
            }

            return { success: true, message: "All suppliers deleted successfully." };
        } catch (error: any) {
            return { success: false, message: `Failed to delete suppliers: ${error.message}` };
        }
    }
}