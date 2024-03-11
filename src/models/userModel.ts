import bcrypt from 'bcrypt';
import supabase from '@/db/supabase';

import {BoolResponseData, RegistrationResponseData, UserItem} from "@/models/types";

interface UserRegister {
    id: number;
    username: string;
}

export const UserModel = {
    // register new user
    async register(username: string, password: string): Promise<RegistrationResponseData> {
        try {
            const hashedPassword = await bcrypt.hash(password, 10);

            const response = await supabase
                .from("users")
                .insert([{ username: username, password: hashedPassword }])
                .select()
                .single();

            const user = response.data as UserRegister | null;
            const userError = response.error;

            if ( userError || !user ) {
                throw new Error(userError?.message ?? "Failed to create user");
            }

            const defaultRoleIds = [1, 2, 3, 4];

            const roleAssignments = defaultRoleIds.map(roleid => ({
                userid: user!.id,
                roleid: roleid
            }));

            let { error: roleError } = await supabase
                .from("user_userroles")
                .insert(roleAssignments);

            if (roleError) throw new Error(roleError.message);

            return { success: true, message: "User registered successfully.", username, id: user.id };
        } catch (error) {
            return { success: false, message: `Registration failed: ${String(error)}` };
        }
    },

    // user login
    async login(username: string, password: string): Promise<BoolResponseData> {
        try {
            let { data, error } = await supabase
                .from("users")
                .select("*")
                .eq("username", username)
                .maybeSingle();

            if (error) {
                throw new Error(error.message);
            }

            if (!data) {
                return { success: false, message: "Username not found." };
            }

            const user = data;
            const passwordMatch = await bcrypt.compare(password, user.password);

            if (passwordMatch) {
                return { success: true, message: "Login successful." };
            } else {
                return { success: false, message: "Invalid username or password." };
            }
        } catch (error) {
            return { success: false, message: `Login error: ${String(error)}` };
        }
    },

    async findId(username: string): Promise<UserItem | null> {
        let { data, error } = await supabase
            .from("users")
            .select("id")
            .eq("username", username)
            .single();

        if (error) {
            console.error(`Query error: ${String(error.message)}`);
            throw new Error(`Query error: ${String(error.message)}`);
        }

        if (data) {
            return { id: data.id, username: username };
        } else {
            return null;
        }
    },

    // update user permission
    async updatePermissions(userId: number, newPermissions: string[]): Promise<boolean> {
        try {
            // Delete existing roles
            let { error: deleteError } = await supabase
                .from("user_userroles")
                .delete()
                .eq("userid", userId);

            if (deleteError) {
                throw deleteError;
            }

            // Insert new roles
            for (const permission of newPermissions) {
                let { data: roles, error: roleError } = await supabase
                    .from("userroles")
                    .select("roleid")
                    .eq("permissions", permission);

                if (roleError) {
                    throw roleError;
                }

                if (roles && roles.length > 0) {
                    const role = roles[0];
                    let { error: insertError } = await supabase
                        .from("user_userroles")
                        .insert([{ userid: userId, roleid: role.roleid }]);

                    if (insertError) throw insertError;
                } else {
                    throw new Error(`No role found for permission: ${permission}`);
                }
            }
            return true;
        } catch (error) {
            console.error("Failed to update user permissions:", error);
            throw error;
        }
    },

    // get user permissions
    async getPermissions(userId: number): Promise<string[]> {
        try
        {
            let { data: userRoles, error: userRolesError } = await supabase
                .from("user_userroles")
                .select("roleid")
                .eq("userid", userId);

            if (userRolesError) {
                throw userRolesError;
            }

            if (!userRoles || userRoles.length === 0) {
                return [];
            }

            const roleIds = userRoles.map(role => role.roleid);

            let { data: permissionsData, error: permissionsError } = await supabase
                .from("userroles")
                .select("permissions")
                .in("roleid", roleIds);

            if (permissionsError) throw permissionsError;
            if (!permissionsData) return [];

            return permissionsData.map(permission => permission.permissions);
        } catch (error) {
            throw error;
        }
    }
}