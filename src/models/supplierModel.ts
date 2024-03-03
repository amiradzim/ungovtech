import { openDb } from '@/db/database';
import {SupplierItem, Result, InventoryItem, BoolResponseData} from "@/models/types";

export const SupplierModel = {
    // create new supplier
    async create(supplier: SupplierItem): Promise<Result<SupplierItem>> {
        const db = await openDb();
        const { name, contactInfo } = supplier;

        if (!name || contactInfo == null) {
            throw new Error("Required fields cannot be empty.");
        }

        try {
            const sql = await db.prepare(
                "INSERT INTO Supplier (name, contactInfo) VALUES (?, ?)"
            );
            const result = await sql.run(supplier.name, supplier.contactInfo);
            await sql.finalize();

            if (result && result.lastID) {
                return { data: { ...supplier, id: result.lastID } };
            } else {
                return { error: "Failed to insert supplier." };
            }
        } catch (error) {
            return { error: `Failed to insert supplier: ${String(error)}` };
        }
    },

    // update supplier
    async update(supplier: SupplierItem): Promise<BoolResponseData> {
        const db = await openDb();
        const { id, name, contactInfo } = supplier;

        try {
            const sql = `
            UPDATE Supplier
            SET name = COALESCE(?, name),
                contactInfo = COALESCE(?, contactInfo)
            WHERE id = ?`;

            const result = await db.run(sql, [name, contactInfo, id]);

            if (result.changes && result.changes > 0) {
                return { success: true, message: "Supplier updated successfully." };
            } else {
                return { success: false, message: "Supplier not found." };
            }
        } catch (error) {
            return { success: false, message: `Failed to update supplier: ${String(error)}` };
        }
    },

    // delete supplier
    async delete(id: number): Promise<BoolResponseData> {
        const db = await openDb();
        const sql = "DELETE FROM Supplier WHERE id = ?";

        try {
            const result = await db.run(sql, [id]);
            if (result.changes && result.changes > 0) {
                return { success: true, message: "Supplier deleted successfully." };
            } else {
                return { success: false, message: "Supplier not found." };
            }
        } catch (error) {
            return { success: false, message: `Failed to delete the supplier: ${String(error)}` };
        }
    },

    // generate 10 random suppliers
    async generate(): Promise<BoolResponseData> {
        const db = await openDb();
        let suppliersCreated = 0;

        try {
            await db.run("BEGIN TRANSACTION");

            for (let i = 0; i < 10; i++) {
                const supplier = {
                    name: `Supplier ${i + 1}`,
                    contactInfo: `Email: supplier${i + 1}@example.com`
                };

                const result = await this.create(supplier);

                if (result.data) {
                    suppliersCreated++;
                }
            }

            await db.run("COMMIT");
            return { success: true, message: `${suppliersCreated} random suppliers created successfully.` };
        } catch (error) {
            await db.run("ROLLBACK");
            return { success: false, message: `Failed to create random suppliers: ${String(error)}` };
        }
    },

    // delete everything in supplier table
    async deleteAll(): Promise<BoolResponseData> {
        const db = await openDb();
        const sql = "DELETE FROM Supplier";
        const resetPkSql = "DELETE FROM sqlite_sequence WHERE name='Supplier'";

        try {
            await db.run('BEGIN');
            await db.run(sql);
            await db.run(resetPkSql);
            await db.run('COMMIT');

            return { success: true, message: "All supplier deleted successfully." };
        } catch (error) {
            await db.run("ROLLBACK");
            return { success: false, message: `Failed to delete supplier or reset PK: ${String(error)}` };
        }
    }
}