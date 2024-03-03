import type { NextApiRequest, NextApiResponse } from 'next';
import { supplierService } from "@/services/supplierService"
import { SupplierResponseData } from "@/models/types";

export default async function handler(req: NextApiRequest, res: NextApiResponse<SupplierResponseData>) {
    if (req.method === "POST") {
        const { name, contactInfo } = req.body;

        const result = await supplierService.addSupplier({ name, contactInfo });

        if (result.data) {
            res.status(201).json({ message: "Item added successfully", data: result.data });
        } else {
            res.status(500).json({ message: result.error ?? "An unexpected error occurred" });
        }
    } else {
        res.setHeader("Allow", ["POST"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}