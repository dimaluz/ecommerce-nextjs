import { UserRole } from '@prisma/client'
import * as z from 'zod'

//Authentication schemas
export const UserSettingsSchema = z.object({
    name: z.optional(z.string()),
    isTwoFactorEnabled: z.optional(z.boolean()),
    role: z.enum([UserRole.CUSTOMER, UserRole.ADMIN]),
    email: z.optional(z.string().email()),
    password: z.optional(z.string().min(6)),
    newPassword: z.optional(z.string().min(6)),
})
    .refine((data) => {
        if (data.password && !data.newPassword) {
            return false
        }

        return true
    },{
        message: "New password is required!",
        path: ["newPassword"]
    })
    .refine((data) => {
        if (data.newPassword && !data.password) {
            return false
        }

        return true
    },{
        message: "Password is required!",
        path: ["password"]
    })

export const NewPasswordSchema = z.object({
    password: z.string().min(6, {
        message: 'Minimum 6 characters required'
    }),
})

export const ResetSchema = z.object({
    email: z.string().email({
        message: 'Email is required'
    }),
})

export const LoginSchema = z.object({
    email: z.string().email({
        message: 'Email is required'
    }),
    password: z.string().min(1, {
        message: 'Password is required'
    }),
    code: z.optional(z.string()),
})

export const RegisterSchema = z.object({

    name: z.string().min(1, {
        message: 'Name is required'
    }),
    email: z.string().email({
        message: 'Email is required'
    }),
    password: z.string().min(6, {
        message: 'Minimum 6 characters required!'
    }),
})

//Dashboard schemas

export const formSchema = z.object({
    name: z.string().min(1),
})

export const settingsSchema = z.object({
    name: z.string().min(1),
})

export const billboardSchema = z.object({
    label: z.string().min(1),
    imageUrl: z.string().min(1),
})

export const categorySchema = z.object({
    name: z.string().min(1),
    billboardId: z.string().min(1),
})

export const sizeSchema = z.object({
    name: z.string().min(1),
    value: z.string().min(1),
})