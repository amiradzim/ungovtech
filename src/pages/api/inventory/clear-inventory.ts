import type { NextApiRequest, NextApiResponse } from 'next';
import { inventoryService } from "@/services/inventoryService";
import { verifyPermissions } from "@/utils/checkPermissions";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "DELETE") {
        const hasPermissions = verifyPermissions(req, ["delete"]);
        if (!hasPermissions) {
            res.status(403).json({ message: "Access denied." });
            return;
        }

        const result = await inventoryService.clearInventory();

        if (result.success) {
            res.status(200).json({ message: "Inventory table has been cleared" });
        } else {
            res.status(500).json({ message: result.error ?? "An unexpected error occurred" });
        }
    } else {
        res.setHeader("Allow", ["DELETE"]);
        res.status(405).end("Method Not Allowed");
    }
}