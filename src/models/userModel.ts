import { openDb } from '@/db/database';
import bcrypt from 'bcrypt';
import {BoolResponseData, RegistrationResponseData} from "@/models/types";

export const UserModel = {
    // register new user
    async register(username: string, password: string): Promise<RegistrationResponseData> {
        const db = await openDb();
        try {
            await db.run("BEGIN TRANSACTION");

            const hashedPassword = await bcrypt.hash(password, 10);
            const sql = "INSERT INTO Users (username, password) VALUES (?, ?)";
            const userResult = await db.run(sql, [username, hashedPassword]);

            if (userResult.lastID) {
                const roleSql = "SELECT roleId FROM UserRoles";
                const roles = await db.all(roleSql);

                for (const role of roles) {
                    const insertRoleSql = "INSERT INTO User_UserRoles (userId, roleId) VALUES (?, ?)";
                    await db.run(insertRoleSql, [userResult.lastID, role.roleId]);
                }

                await db.run("COMMIT");
                return { success: true, message: "User registered successfully and roles assigned.", username: username, id: userResult.lastID };
            } else {
                await db.run("ROLLBACK");
                return { success: false, message: "Failed to register user." };
            }
        } catch (error) {
            await db.run("ROLLBACK");
            return { success: false, message: `Failed to register user: ${String(error)}` };
        }
    },

    // user login
    async login(username: string, password: string): Promise<BoolResponseData> {
        const db = await openDb();
        try {
            const sql = "SELECT * FROM Users WHERE username = ?";
            const user = await db.get(sql, [username]);

            if (user) {
                const passwordMatch = await bcrypt.compare(password, user.password);
                if (passwordMatch) {
                    return { success: true, message: "Login successful." };
                } else {
                    return { success: false, message: "Invalid username or password." };
                }
            } else {
                return { success: false, message: "Username is not found." };
            }
        } catch (error) {
            return { success: false, message: `Login error: ${String(error)}` };
        }
    },
}