'use server'

import * as z from 'zod'

import { db } from '@/lib/db'
import { UserSettingsSchema } from '@/schemas'
import { getUserById } from '@/data/user'
import { auth } from '@/auth'


export const userSettings = async (values: z.infer<typeof UserSettingsSchema>) => {
    const existedUser = await auth();

    if (!existedUser?.user) {
        return {error: 'Unauthorized'}
    }

    const dbUser = await getUserById(existedUser.user.id)

    if (!dbUser) {
        return {error: 'Unauthorized'}
    }

    await db.user.update({
        where: {id: dbUser.id},
        data: {
            ...values,
        },
    })
    return {success: 'Settings updated!'}
}