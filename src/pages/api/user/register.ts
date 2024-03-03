import type { NextApiRequest, NextApiResponse } from 'next';
import { userService } from "@/services/userServices";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        const { username, password } = req.body;

        const result = await userService.registerUser( username, password );

        if (result.success) {
            res.status(200).json({ data: result });
        } else {
            res.status(500).json({ message: result.message ?? "An unexpected error occurred" });
        }
    } else {
        res.setHeader("Allow", ["POST"]);
        res.status(405).end("Method Not Allowed");
    }
}