import type { NextApiRequest, NextApiResponse } from 'next';
import { generateJwt } from '@/utils/authToken';
import { UserModel } from '@/models/userModel';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        const { userId, newPermissions } = req.body;

        const updateSuccess = await UserModel.updatePermissions(userId, newPermissions);

        if (!updateSuccess) {
            return res.status(500).json({ message: 'Failed to update user permissions.' });
        }

        const newJwt = await generateJwt(userId);

        res.status(200).json({ token: newJwt });
    } else {
        res.setHeader("Allow", ["POST"]);
        res.status(405).end("Method Not Allowed");
    }
}