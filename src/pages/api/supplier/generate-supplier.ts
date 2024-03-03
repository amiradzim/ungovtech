import type { NextApiRequest, NextApiResponse } from 'next';
import { supplierService } from "@/services/supplierService";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        const result = await supplierService.generateSupplier();

        if (result.success) {
            res.status(200).json({ message: "10 random suppliers have been generated" });
        } else {
            res.status(500).json({ message: result.error ?? "An unexpected error occurred" });
        }
    } else {
        res.setHeader("Allow", ["POST"]);
        res.status(405).end("Method Not Allowed");
    }
}