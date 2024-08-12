import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { request_url } from "../../../utils/config"


export const authOptions = {
    // Configure one or more authentication providers
    secret: process.env.NEXTAUTH_SECRET,
    site: process.env.NEXTAUTH_URL,
    session: {
        strategy: "jwt"
    },
    providers: [

        CredentialsProvider({
            type: "credentials",
            credentials: {},
            async authorize(credentials, req) {
                var user = {}

                //credentials.status is admin or user
                await fetch(`${request_url}/auth/signin`, {
                    method: "POST",
                    body: JSON.stringify({
                        "email": credentials.email,
                        "password": credentials.password
                    })
                }).catch((err) => {
                }).then(async (response) => {
                    
                    user = await response.json()
                })

                if (user.response === "found") {
                    return user.data
                } else {
                    return null
                }

            }
        })
    ],
    session: {
        jwt: true,
        maxAge: 30 * 24 * 60 * 60,
    },
    callbacks: {
        // order of excecutation=  signIn -> jwt -> session
        async signIn({ user, account, profile }) {


            if (user) return true;
            return false;


        },
        async session({ session, token, user }) {

            session.user = token.user;

            return session;
        },
        async jwt({ token, user }) {


            if (user) {
                token.user = user;
            }

            return token;
        },
    },

}
export default NextAuth(authOptions)