import jwt from "jsonwebtoken";
import { randomBytes } from "crypto";
import { AuthModel } from "@/models/authModel";
import { UserModel } from "@/models/userModel"

const JWT_SECRET = process.env.JWT_SECRET || "YOUSHALLNOTPASS";

// generates new jwt
export const generateJwt = async (userId: number, expiresIn: string = "3h"): Promise<string> => {
    const jti = generateJTI();
    const permissions = await UserModel.getPermissions(userId);

    const tokenPayload = { userId, jti, permissions };

    const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn });

    await AuthModel.invalidateUserToken(userId);
    await AuthModel.storeNewToken(jti, userId);

    return token;
};

// checks if the jti in the current jwt matches the jti in the database
export const checkJwt = async (token: string): Promise<boolean> => {
    try {
        const decodedToken = jwt.verify(token, JWT_SECRET);

        if (typeof decodedToken === 'object' && decodedToken !== null && 'jti' in decodedToken && typeof decodedToken.jti === 'string') {
            return await AuthModel.isTokenValid(decodedToken.jti);
        }
        return false;
    } catch (error) {
        console.error("Error verifying JWT:", error);
        return false;
    }
};

const generateJTI = (): string => {
    return randomBytes(16).toString("hex");
};


