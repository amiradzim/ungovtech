import { openDb } from '@/db/database';

export const AuthModel = {
    async invalidateUserToken(userId: number): Promise<void> {
        const db = await openDb();
        const sqlGet = "SELECT * FROM TokenStore WHERE userId = ? AND isValid = 1";
        const sqlUpdate = "UPDATE TokenStore SET isValid = FALSE WHERE userId = ?";

        const currToken = await db.get(sqlGet, [userId]);
        console.log("current token:",currToken)
        if (currToken) {
            await db.run(sqlUpdate, [userId]);
        }
    },

    async storeNewToken(tokenIdent: string, userId: number): Promise<void> {
        const db = await openDb();
        const sql = "INSERT INTO TokenStore (tokenIdent, userId, isValid) VALUES (?, ?, TRUE)";
        await db.run(sql, [tokenIdent, userId]);
    },

    async isTokenValid(tokenIdent: string): Promise<boolean> {
        const db = await openDb();
        const sql = "SELECT isValid FROM TokenStore WHERE tokenIdent = ?";
        const token = await db.get(sql, [tokenIdent]);

        if (token) {
            return token.isValid;
        } else {
            return false;
        }
    },
};