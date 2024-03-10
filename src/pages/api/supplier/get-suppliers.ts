import {NextApiRequest, NextApiResponse} from "next";
import {SuppliersResponseData} from "@/models/types";
import {supplierService} from "@/services/supplierService";

export default async function handler(req: NextApiRequest, res: NextApiResponse<SuppliersResponseData>) {
    if (req.method === "GET") {
        try {
            const result = await supplierService.getSuppliers();

            if (result.data) {
                res.status(200).json({ message: "Suppliers retrieved successfully", data: result.data });
            } else {
                res.status(404).json({ message: "No suppliers found" });
            }
        } catch (error) {
            res.status(500).json({ message: String(error) || "An unexpected error occurred" });
        }
    } else {
        res.setHeader("Allow", ["GET"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}