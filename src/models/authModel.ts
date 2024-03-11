import supabase from '@/db/supabase';

export const AuthModel = {
    // invalidate current user token
    async invalidateUserToken(userId: number): Promise<void> {
        const { data, error } = await supabase
            .from("tokenstore")
            .update({ isvalid: false })
            .match({ userid: userId, isvalid: true });

        if (error) {
            console.error("Error invalidating user token:", error);
            throw error;
        }
    },

    // store new token
    async storeNewToken(tokenIdent: string, userId: number): Promise<void> {
        const { data, error } = await supabase
            .from("tokenstore")
            .insert([
                { tokenident: tokenIdent, userid: userId, isvalid: true }
            ]);

        if (error) {
            console.error("Error storing new token:", error);
            throw error;
        }
    },

    // check if current jti in token matches the jti in database that is valid
    async isTokenValid(tokenIdent: string): Promise<boolean> {
        const { data, error } = await supabase
            .from("tokenstore")
            .select("isvalid")
            .eq("tokenident", tokenIdent)
            .single();

        if (error) {
            console.error("Error checking token validity:", error);
            return false;
        }

        return data ? data.isvalid : false;
    },
};