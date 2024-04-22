import type { NextAuthConfig } from "next-auth"
import Credentials from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import Facebook from 'next-auth/providers/facebook'
import Google from 'next-auth/providers/google'

import { LoginSchema } from "@/schemas"
import { getUserByEmail } from "@/data/user"

export default {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Facebook({
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    }),
    Credentials({
      async authorize(credentials) {
        const validatedFields = LoginSchema.safeParse(credentials)
        if (validatedFields.success){
          const { email, password } = validatedFields.data
          const user = await getUserByEmail(email)
          if (!user || !user.password) return null

          const passwordsMatched = await bcrypt.compare(
            password,
            user.password,
          )

          if (passwordsMatched) return user;
        }
        return null;
      }
    })
  ],
} satisfies NextAuthConfig