import type { NextApiRequest, NextApiResponse } from 'next';
import { inventoryService } from "@/services/inventoryService";
import { verifyPermissions } from "@/utils/checkPermissions";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "PUT") {
        const { id, name, description, price, supplierid } = req.body;

        const hasPermissions = verifyPermissions(req, ["update"]);
        if (!hasPermissions) {
            res.status(403).json({ message: "Access denied." });
            return;
        }

        if (!id || isNaN(Number(id))) {
            res.status(400).json({ message: "Invalid or missing product ID" });
            return;
        }

        const result = await inventoryService.updateProduct({ id, name, description, price, supplierid });

        if (result.success) {
            res.status(200).json({ message: "Product updated successfully" });
        } else {
            res.status(500).json({ message: result.error ?? "An unexpected error occurred" });
        }
    } else {
        res.setHeader("Allow", ["PUT"]);
        res.status(405).end("Method Not Allowed");
    }
}