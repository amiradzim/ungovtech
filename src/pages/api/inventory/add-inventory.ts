import type { NextApiRequest, NextApiResponse } from 'next';
import { inventoryService } from "@/services/inventoryService";
import { InventoryResponseData } from "@/models/types";
import { verifyPermissions } from "@/utils/checkPermissions";

export default async function handler(req: NextApiRequest, res: NextApiResponse<InventoryResponseData>) {
    if (req.method === "POST") {
        const { name, description, price, supplierId } = req.body;

        const hasPermissions = verifyPermissions(req, ["create"]);
        if (!hasPermissions) {
            res.status(403).json({ message: "Access denied." });
            return;
        }

        const result = await inventoryService.addInventoryItem({ name, description, price, supplierId });

        if (result.data) {
            res.status(201).json({ message: "Item added successfully", data: result.data });
        } else {
            res.status(500).json({ message: result.error ?? "An unexpected error occurred" });
        }
    } else {
        res.setHeader("Allow", ["POST"]);
        res.status(405).end("Method Not Allowed");
    }
}