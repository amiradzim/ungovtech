import type { NextApiRequest, NextApiResponse } from 'next';
import { inventoryService } from "@/services/inventoryService";
import { verifyPermissions } from "@/utils/checkPermissions";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {

        const hasPermissions = verifyPermissions(req, ["create"]);
        if (!hasPermissions) {
            res.status(403).json({ message: "Access denied." });
            return;
        }
        const result = await inventoryService.generateProducts();

        if (result.success) {
            res.status(200).json({ message: "1000 random products have been generated" });
        } else {
            res.status(500).json({ message: result.error ?? "An unexpected error occurred" });
        }
    } else {
        res.setHeader("Allow", ["POST"]);
        res.status(405).end("Method Not Allowed");
    }
}