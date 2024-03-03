import { UserModel } from "@/models/userModel";
import {UserItem} from "@/models/types";

export const userService = {
    async registerUser(username: string, password: string) {
        return UserModel.register(username, password);
    },
    async loginUser(username: string, password: string) {
        return UserModel.login(username, password);
    },
    async findUserId(username: string): Promise<UserItem | null> {
        return UserModel.findId(username);
    }
};