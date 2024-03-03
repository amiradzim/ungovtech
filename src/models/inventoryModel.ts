import { openDb } from '@/db/database';
import {InventoryItem, Result, InventoryPaginatedResult, BoolResponseData} from './types';

export const InventoryModel = {
    // create new product
    async create(product: InventoryItem): Promise<Result<InventoryItem>> {
        const db = await openDb();
        const { name, description, price, supplierId } = product;

        if (!name || price == null || supplierId == null) {
            throw new Error("Required fields cannot be empty.");
        }

        try {
            const sql = await db.prepare(
                "INSERT INTO Inventory (name, description, price, supplierId) VALUES (?, ?, ?, ?)"
            );
            const result = await sql.run(product.name, product.description, product.price, product.supplierId);
            await sql.finalize();

            if (result && result.lastID) {
                return { data: { ...product, id: result.lastID } };
            } else {
                return { error: "Failed to insert inventory product." };
            }
        } catch (error) {
            return { error: `Failed to insert inventory product: ${String(error)}` };
        }
    },

    // get products with pagination and filter
    async getAll(page: number, pageSize: number, priceCondition?: 'More' | 'Less', priceValue?: number, sortOrder?: 'Asc' | 'Desc', supplierId?: number): Promise<InventoryPaginatedResult<InventoryItem>> {
        const db = await openDb();
        const offset = (page - 1) * pageSize;

        let sql = `
        SELECT Inventory.*, Supplier.name AS supplierName, Supplier.contactInfo AS supplierContact
        FROM Inventory
        JOIN Supplier ON Inventory.supplierId = Supplier.id
        `;
        let countSql = "SELECT COUNT(*) AS total FROM Inventory";

        const params: (number | string)[] = [];
        const countParams: number[] = [];
        let whereClause = "";

        if (priceCondition && priceValue !== undefined && !isNaN(priceValue)) {
            whereClause += whereClause ? " AND" : " WHERE";
            whereClause += priceCondition === "More" ? " price > ?" : " price < ?";
            params.push(priceValue);
            countParams.push(priceValue);
        }

        if (supplierId !== undefined && !isNaN(supplierId)) {
            whereClause += whereClause ? " AND" : " WHERE";
            whereClause += " supplierId = ?";
            params.push(supplierId);
            countParams.push(supplierId);
        }

        sql += whereClause;
        countSql += whereClause;

        if (sortOrder) {
            sql += sortOrder === "Asc" ? " ORDER BY price ASC" : " ORDER BY price DESC";
        }

        sql += " LIMIT ? OFFSET ?";
        params.push(pageSize, offset);

        try {
            const rows = await db.all(sql, params);
            const totalResult = await db.get(countSql, countParams);
            const total = totalResult.total;
            return { data: rows, total };
        } catch (error) {
            throw new Error(`Failed to fetch paginated products: ${String(error)}`);
        }
    },

    // get product by id
    async get(id: number): Promise<Result<InventoryItem>> {
        const db = await openDb();
        const sql = "SELECT * FROM Inventory WHERE id = ?";

        try {
            const product = await db.get(sql, [id])
            if (product) {
                return { data: product};
            } else {
                return { error: "Product not found."};
            }
        } catch (error) {
            return { error: `Failed to fetch the product: ${String(error)}` };
        }
    },

    // delete product
    async delete(id: number): Promise<BoolResponseData> {
        const db = await openDb();
        const sql = "DELETE FROM Inventory WHERE id = ?";

        try {
            const result = await db.run(sql, [id]);
            if (result.changes && result.changes > 0) {
                return { success: true, message: "Product deleted successfully." };
            } else {
                return { success: false, message: "Product not found." };
            }
        } catch (error) {
            return { success: false, message: `Failed to delete the product: ${String(error)}` };
        }
    },

    // update product
    async update(product: InventoryItem): Promise<BoolResponseData> {
        const db = await openDb();
        const { id, name, description, price, supplierId } = product;

        try {
            const sql = `
            UPDATE Inventory
            SET name = COALESCE(?, name),
                description = COALESCE(?, description),
                price = COALESCE(?, price),
                supplierId = COALESCE(?, supplierId)
            WHERE id = ?`;

            const result = await db.run(sql, [name, description, price, supplierId, id]);

            if (result.changes && result.changes > 0) {
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
        const db = await openDb();

        try {
            const suppliers = await db.all("SELECT id FROM Supplier");
            const supplierIds = suppliers.map(supplier => supplier.id);

            if (supplierIds.length === 0) {
                return { success: false, message: "No suppliers found. Cannot generate products." };
            }

            let productsCreated = 0;
            await db.run("BEGIN TRANSACTION");

            for (let i = 0; i < 1000; i++) {
                const name = `Product ${i + 1}`;
                const description = `Description for product ${i + 1}`;
                const price = parseFloat((Math.random() * (1000 - 10) + 10).toFixed(2));

                const supplierId = supplierIds[Math.floor(Math.random() * supplierIds.length)];

                const result = await this.create({ name, description, price, supplierId });

                if (result.data) {
                    productsCreated++;
                }
            }

            await db.run("COMMIT");
            return { success: true, message: `${productsCreated} products created successfully.` };
        } catch (error) {
            await db.run("ROLLBACK");
            return { success: false, message: `Failed to create products: ${String(error)}` };
        }
    },

    // delete everything in inventory
    async deleteAll(): Promise<BoolResponseData> {
        const db = await openDb();
        const sql = "DELETE FROM Inventory";
        const resetPkSql = "DELETE FROM sqlite_sequence WHERE name='Inventory'";

        try {
            await db.run('BEGIN');
            await db.run(sql);
            await db.run(resetPkSql);
            await db.run('COMMIT');

            return { success: true, message: "All products deleted successfully." };
        } catch (error) {
            await db.run("ROLLBACK");
            return { success: false, message: `Failed to delete products or reset PK: ${String(error)}` };
        }
    }
};

