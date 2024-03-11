import jwt, {JwtPayload} from 'jsonwebtoken';
import { NextApiRequest } from "next";

const JWT_SECRET = process.env.JWT_SECRET || 'YOUSHALLNOTPASS';

export const verifyPermissions = (req: NextApiRequest, requiredPermissions: string[]): boolean => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return false;
    }
    try {
        const decodedToken = jwt.verify(token, JWT_SECRET);
        if (typeof decodedToken === "object" && decodedToken !== null && "permissions" in decodedToken) {
            const permissions = (decodedToken as JwtPayload & { permissions: string[] }).permissions;

            return requiredPermissions.every(permission =>
                permissions.includes(permission)
            );
        }
        return false;
    } catch (error) {
        console.error("Error verifying token:", error);
        return false;
    }
};