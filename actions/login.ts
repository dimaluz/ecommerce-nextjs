'use server'

import * as z from 'zod'
import { AuthError } from 'next-auth'

import { signIn } from '@/auth'
import { LoginSchema } from '@/schemas'
import { DEFAULT_LOGIN_REDIRECT } from '@/routes'
import { sendVerificationEmail, sendTwoFactorTokenEmail } from '@/lib/mail'
import { generateVerificationToken } from '@/lib/tokens'
import { getUserByEmail } from '@/data/user'
import { generateTwoFactorToken } from '@/lib/tokens'
import { getTwoFactorTokenByEmail } from '@/data/two-factor-token' 
import { db } from '@/lib/db'
import { getTwoFactorConfirmationByUserId } from '@/data/two-factor-confirmation'


export const login = async (values: z.infer<typeof LoginSchema>) => {
    const validatedFields = LoginSchema.safeParse(values)

    if (!validatedFields.success) {
        return {error: 'Invalid fields!'}
    }

    const { email, password, code } = validatedFields.data

    const existedUser = await getUserByEmail(email)

    if (!existedUser || !existedUser.email || existedUser.password) {
        return {error: 'Email does not exist!'}
    }


    if (!existedUser.emailVerified) {
        const verificationToken = await generateVerificationToken(existedUser.email)
        await sendVerificationEmail(verificationToken.email, verificationToken.token)
        return {success: 'Confirmation email sent!'}
    }

    if (existedUser.isTwoFactorEnabled && existedUser.email) {
        if (code) {
            const twoFactorToken = await getTwoFactorTokenByEmail(existedUser.email)
            if (!twoFactorToken) {
                return { error: 'Invalid code!' }
            }
            if (twoFactorToken.token !== code) {
                return { error: 'Invalid code!' }
            }
            const hasExpired = new Date(twoFactorToken.expires) < new Date()

            if (hasExpired) {
                return {error: 'Code expired!'}
            }
            await db.twoFactorToken.delete({
                where: {id: twoFactorToken.id}
            })

            const existedConfirmation = await getTwoFactorConfirmationByUserId(existedUser.id)

            if (existedConfirmation) {
                await db.twoFactorConfirmation.delete({
                    where: { id: existedConfirmation.id }
                })
            }

            await db.twoFactorConfirmation.create({
                data: {
                    userId: existedUser.id
                }
            })
        }
        else {
            const twoFactorToken = await generateTwoFactorToken(existedUser.email)
            await sendTwoFactorTokenEmail(
                twoFactorToken.email,
                twoFactorToken.token,
            )
            return {twoFactor: true}
        }
        
    }

    try {
        await signIn("credentials", {
            email,
            password,
            redirectTo: DEFAULT_LOGIN_REDIRECT,
        })
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return {error: 'Invalid credentials!'}
                default:
                    return {error: 'Something went wrong!'}
            }
        }
        throw error
    }
}