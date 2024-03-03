import type { NextApiRequest, NextApiResponse } from 'next';
import { inventoryService } from "@/services/inventoryService";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "DELETE") {
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