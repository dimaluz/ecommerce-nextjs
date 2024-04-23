import NextAuth, {type DefaultSession} from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { JWT } from "next-auth/jwt"



import authConfig from '@/auth.config'
import { db } from '@/lib/db'
import { getUserById } from '@/data/user'

declare module "next-auth" {
    interface Session {
        user: {
            role: string
        } & DefaultSession["user"]
    }
}

declare module "next-auth/jwt" {
    /** Returned by the `jwt` callback and `auth`, when using JWT sessions */
    interface JWT {
      role?: "ADMIN" | "CUSTOMER"
    }
}

export const {
    handlers: { GET, POST },
    auth,
    signIn,
    signOut,
} = NextAuth({
    pages: {
        signIn: "/auth/login",
        error: "/auth/error",
    },
    events: {
        async linkAccount({ user }) {
            db.user.update({
                where: {id: user.id},
                data: {emailVerified: new Date()}
            })
        }
    },
    callbacks: {
        async signIn ({ user, account }) {
            //Allow OAuth without email verification
            if (account?.provider !== "credentials") return true

            const existedUser = await getUserById(user.id)

            //Prevent sign in without email verification
            if (!existedUser.emailVerified) return false

            return true
        },
        async session ({ token, session }) {
            if (token.sub && session.user){
                session.user.id = token.sub
            }

            if (token.role && session.user) {
                session.user.role = token.role
            }

            return session
        },
        async jwt({ token }) {
            if (!token.sub) return token

            const existedUser = await getUserById(token.sub)

            if (!existedUser) return token

            token.role = existedUser.role

            return token
        },
    },
    adapter: PrismaAdapter(db),
    session: { strategy: 'jwt' },
    ...authConfig,
})