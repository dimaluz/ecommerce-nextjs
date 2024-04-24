'use server'

import * as z from 'zod'

import { db } from "@/lib/db"
import { formSchema } from "@/schemas"
import { auth } from '@/auth'

export const CreateNewStore = async (values: z.infer<typeof formSchema>) => {
    
    const validatedFields = formSchema.safeParse(values)
    const existedUser = await auth()
    //Check if user is ADMIN
    if (!existedUser) {
        return {error: 'Unauthorized'}
    }
    console.log("USER: ", existedUser?.user.id)

    if (!validatedFields.success) {
        return {error: 'Invalid name!'}
    }

    await db.store.create({
        data: {
            name: validatedFields.data.name,
            userId: existedUser.user.id,
        }
    })

    return {success: 'New store was created successfully!'}
}