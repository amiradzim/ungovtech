import type { NextApiRequest, NextApiResponse } from 'next';
import { supplierService } from "@/services/supplierService";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "PUT") {
        const { id, name, contactinfo } = req.body;

        if (!id || isNaN(Number(id))) {
            res.status(400).json({ message: "Invalid or missing supplier ID" });
            return;
        }

        const result = await supplierService.updateSupplier({ id, name, contactinfo });

        if (result.success) {
            res.status(200).json({ message: "Supplier updated successfully" });
        } else {
            res.status(500).json({ message: result.error ?? "An unexpected error occurred" });
        }
    } else {
        res.setHeader("Allow", ["PUT"]);
        res.status(405).end("Method Not Allowed");
    }
}