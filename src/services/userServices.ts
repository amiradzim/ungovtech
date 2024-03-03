import { UserModel } from "@/models/userModel";

export const userService = {
    async registerUser(username: string, password: string) {
        return UserModel.register(username, password);
    },
    async loginUser(username: string, password: string) {
        return UserModel.login(username, password);
    },
};