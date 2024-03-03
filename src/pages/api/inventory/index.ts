import type { NextApiRequest, NextApiResponse } from 'next';
import { inventoryService } from '@/services/inventoryService'; // Ensure the correct import paths

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "GET") {
        const { page = 1, pageSize = 10, priceCondition, priceValue, sortOrder, supplierId } = req.query;

        try {
            const result = await inventoryService.fetchPaginatedProducts(
                Number(page),
                Number(pageSize),
                priceCondition as "More" | "Less" | undefined,
                priceValue ? Number(priceValue) : undefined,
                sortOrder as "Asc" | "Desc" | undefined,
                supplierId ? Number(supplierId) : undefined
            );

            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ message: `Failed to fetch products: ${String(error)}` });
        }
    } else {
        res.setHeader("Allow", ["GET"]);
        res.status(405).end("Method Not Allowed");
    }
}