import supabase from '@/db/supabase';
import { InventoryItem, Result, InventoryPaginatedResult, BoolResponseData } from './types';

export const InventoryModel = {

    async create(product: InventoryItem): Promise<Result<InventoryItem>> {
        const { name, description, price, supplierid } = product;

        if (!name || price == null || supplierid == null) {
            throw new Error("Required fields cannot be empty.");
        }

        try {
            const { data, error } = await supabase
                .from("inventory")
                .insert([
                    { name, description, price, supplierid }
                ])
                .select()
                .single();

            if (error) {
                return { error: `Failed to insert inventory product: ${error.message}` };
            }

            const insertedProduct = data as InventoryItem;

            if (insertedProduct) {
                return { data: insertedProduct };
            } else {
                return { error: "Failed to insert inventory product." };
            }
        } catch (error) {
            return { error: `Failed to insert inventory product: ${String(error)}` };
        }
    },

    // get products with pagination and filter
    async getAll(page: number, pageSize: number, priceCondition?: "More" | "Less", priceValue?: number, sortOrder?: "Asc" | "Desc", supplierId?: number): Promise<InventoryPaginatedResult<InventoryItem>> {
        const offset = (page - 1) * pageSize;

        let query = supabase
            .from("inventory")
            .select("*, supplier (name, contactinfo)", { count: "exact" })
            .range(offset, offset + pageSize - 1);

        if (priceCondition && priceValue !== undefined) {
            query = priceCondition === "More" ? query.gte("price", priceValue) : query.lte("price", priceValue);
        }

        if (supplierId !== undefined) {
            query = query.eq("supplierid", supplierId);
        }

        if (sortOrder) {
            query = sortOrder === "Asc" ? query.order("price", { ascending: true }) : query.order("price", { ascending: false });
        } else {
            query = query.order("id", { ascending: true });
        }

        try {
            const { data, error, count } = await query;

            if (error) throw new Error(`Failed to fetch paginated products: ${error.message}`);

            const transformedData = data?.map(item => ({
                ...item,
                supplierName: item.Supplier?.name,
                supplierContact: item.Supplier?.contactinfo
            })) ?? [];

            return { data: transformedData, total: count ?? 0 };
        } catch (error) {
            throw new Error(`Failed to fetch paginated products: ${String(error)}`);
        }
    },

    // get product by id
    async get(id: number): Promise<Result<InventoryItem>> {
        try {
            let { data, error } = await supabase
                .from("inventory")
                .select("*, supplier (name, contactinfo)")
                .eq("id", id)
                .single();

            if (error) {
                return { error: `Failed to fetch the product: ${error.message}` };
            }

            if (data) {
                const inventoryItem: InventoryItem = {
                    ...data,
                    supplierName: data.supplier.name,
                    supplierContact: data.supplier.contactinfo
                };
                return { data: inventoryItem };
            } else {
                return { error: "Product not found." };
            }
        } catch (error) {
            return { error: `Failed to fetch the product: ${String(error)}` };
        }
    },

    // delete product
    async delete(id: number): Promise<BoolResponseData> {
        try {
            const { data: item, error: fetchError } = await supabase
                .from("inventory")
                .select()
                .eq("id", id)
                .single();

            if (fetchError || !item) {
                return { success: false, message: "Product not found." };
            }

            const { error: deleteError } = await supabase
                .from("inventory")
                .delete()
                .match({ id });

            if (deleteError) {
                return { success: false, message: `Failed to delete the product: ${deleteError.message}` };
            }

            return { success: true, message: "Product deleted successfully." };
        } catch (error) {
            return { success: false, message: `Failed to delete the product: ${String(error)}` };
        }
    },

    // update product
    async update(product: InventoryItem): Promise<BoolResponseData> {
        const { id, name, description, price, supplierid } = product;

        if (!id) {
            return { success: false, message: "Product ID is required." };
        }

        try {
            const { data, error } = await supabase
                .from("inventory")
                .update({
                    name: name,
                    description: description,
                    price: price,
                    supplierid: supplierid
                })
                .eq("id", id)
                .select();

            if (error) {
                return { success: false, message: `Failed to update product: ${error.message}` };
            }

            if (data && data.length > 0) {
                return { success: true, message: "Product updated successfully." };
            } else {
                return { success: false, message: "Product not found." };
            }
        } catch (error) {
            return { success: false, message: `Failed to update product: ${String(error)}` };
        }
    },

    // create 1000 random products
    async generate(): Promise<BoolResponseData> {
        const { data: suppliers, error: supplierError } = await supabase
            .from("supplier")
            .select("id");

        if (supplierError) {
            return { success: false, message: `Failed to fetch suppliers: ${supplierError.message}` };
        }

        const supplierIds = suppliers.map(supplier => supplier.id);

        if (supplierIds.length === 0) {
            return { success: false, message: "No suppliers found. Cannot generate products." };
        }

        let productsCreated = 0;

        try {
            for (let i = 0; i < 1000; i++) {
                const name = `Product ${i + 1}`;
                const description = `Description for product ${i + 1}`;
                const price = parseFloat((Math.random() * (1000 - 10) + 10).toFixed(2));
                const supplierid = supplierIds[Math.floor(Math.random() * supplierIds.length)];

                const { error } = await supabase
                    .from("inventory")
                    .insert([{ name, description, price, supplierid }]);

                if (error) {
                    throw new Error(`Failed to create product: ${error.message}`);
                }

                productsCreated++;
            }

            return { success: true, message: `${productsCreated} products created successfully.` };
        } catch (error: any) {
            return { success: false, message: `Failed to create products: ${error.message}` };
        }
    },

    // delete everything in inventory
    async deleteAll(): Promise<BoolResponseData> {
        try {
            const { error } = await supabase
                .from("inventory")
                .delete()
                .gte("id", 0);

            if (error) {
                return { success: false, message: `Failed to delete all products: ${error.message}` };
            }

            return { success: true, message: "All products deleted successfully." };
        } catch (error: any) {
            return { success: false, message: `Failed to delete products: ${error.message}` };
        }
    }
};

