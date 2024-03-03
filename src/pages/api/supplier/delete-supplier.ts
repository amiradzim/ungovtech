import type { NextApiRequest, NextApiResponse } from 'next';
import { supplierService } from "@/services/supplierService";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "DELETE") {
        const { id } = req.body;

        if (!id || isNaN(Number(id))) {
            res.status(400).json({ message: "Invalid or missing product ID" });
            return;
        }

        const result = await supplierService.deleteSupplier(id);

        if (result.success) {
            res.status(200).json({ message: "Supplier deleted successfully"});
        } else {
            res.status(500).json({ message: result.error ?? "An unexpected error occurred" });
        }
    } else {
        res.setHeader("Allow", ["DELETE"]);
        res.status(405).end("Method Not Allowed");
    }
}