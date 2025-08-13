import User from "@/models/userModel";
import connectToDB from "@/utils/DAO";
import NextAuth from "next-auth/next";
import  CredentialsProvider  from "next-auth/providers/credentials";
import bcrypt from "bcrypt";

export const authOptions = {
    session: {
        strategy: "jwt",
    },
   secret: process.env.NEXTAUTH_SECRET,
    providers: [ 
        CredentialsProvider({
            async authorize(credentials, request){
                const {email, password} = credentials;
                await connectToDB();
                console.log("[AUTH] Tentando login para:", email);
                const user = await User.findOne({
                    email: email.toLowerCase(),
                }).select("+password");
                if (!user) {
                    console.log("[AUTH] Usuário não encontrado:", email);
                    return null;
                }
                console.log("[AUTH] Usuário encontrado:", user.email, "Role:", user.role);
                const senhaOk = await bcrypt.compare(password, user.password);
                if (!senhaOk) {
                    console.log("[AUTH] Senha incorreta para:", email);
                    return null;
                }
                console.log("[AUTH] Login OK para:", email);
                return {
                    email: user.email,
                    name: user.firstName + " " + user.lastName,
                    role: user.role,
                    empresaId: user.empresaId,
                };
            },
            
        }),
    ],
    callbacks:{
        async jwt({ token, user }) {
            if (user) {
                token.user = user;
            }
            return token;
        },
        async session({ session, token }) {
            session.user.role = token.user.role;
            session.user.empresaId = token.user.empresaId;
            return session;
        },
    },    
};
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST};