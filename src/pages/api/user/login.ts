import type { NextApiRequest, NextApiResponse } from 'next';
import { userService } from "@/services/userServices";
import { generateJwt } from "@/utils/authToken";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        const { username, password } = req.body;

        const result = await userService.loginUser( username, password );
        const user = await userService.findUserId(username);

        if (result.success && user && user.id !== undefined) {
            const newJwt = await generateJwt(user.id);

            if (newJwt) {
                res.status(200).json({ message: "Login successful", token: newJwt });
            } else {
                res.status(500).json({ message: "Failed to generate JWT." });
            }
        } else {
            res.status(500).json({ message: result.message ?? "An unexpected error occurred" });
        }
    } else {
        res.setHeader("Allow", ["POST"]);
        res.status(405).end("Method Not Allowed");
    }
}