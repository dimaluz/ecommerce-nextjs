import NextAuth, {type DefaultSession} from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { JWT } from "next-auth/jwt"



import authConfig from '@/auth.config'
import { db } from '@/lib/db'
import { getUserById } from '@/data/user'
import { getTwoFactorConfirmationByUserId } from '@/data/two-factor-confirmation'
import { getAccountByUserId } from './data/account'

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
            if (!existedUser?.emailVerified) return false

            if (existedUser?.isTwoFactorEnabled){
                const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(existedUser.id)

                if(!twoFactorConfirmation) {
                    return false
                }
                await db.twoFactorConfirmation.delete({
                    where: { id: twoFactorConfirmation.id }
                })
            }


            return true
        },
        async session ({ token, session }) {
            if (token.sub && session.user){
                session.user.id = token.sub
            }

            if (token.role && session.user) {
                session.user.role = token.role
            }

            if (session.user) {
                session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean
            }

            if (session.user) {
                session.user.name = token.name
                session.user.email = token.email
                session.user.isOAuth = token.isOAuth as boolean 
            }

            return session
        },
        async jwt({ token }) {
            if (!token.sub) return token

            const existedUser = await getUserById(token.sub)

            if (!existedUser) return token

            const existedAccount = await getAccountByUserId(existedUser.id)

            token.isOAuth = !!existedAccount
            token.name = existedUser.name
            token.email = existedUser.email
            token.role = existedUser.role
            token.isTwoFactorEnabled = existedUser.isTwoFactorEnabled

            return token
        },
    },
    adapter: PrismaAdapter(db),
    session: { strategy: 'jwt' },
    ...authConfig,
})