import type { NextApiRequest, NextApiResponse } from 'next';
import { inventoryService } from '@/services/inventoryService'; // Adjust the import path as necessary

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "GET") {
        const {id} = req.query;

        if (!id) {
            res.status(400).json({message: "Invalid item ID"});
            return;
        }

        const result = await inventoryService.getProductById(Number(id));

        if (result.data) {
            res.status(200).json(result.data);
        } else {
            res.status(404).json({message: result.error ?? "Item not found"});
        }
    } else {
        res.setHeader("Allow", ["GET"]);
        res.status(405).end("Method Not Allowed");
    }
}