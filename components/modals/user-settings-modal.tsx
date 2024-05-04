'use client'

import { useState } from "react"
import { useSession } from "next-auth/react"
import * as z from 'zod'
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { Modal } from "@/components/ui/modal"
import { Button } from "@/components/ui/button"
import { useUserSettingsModal } from "@/hooks/use-user-settings-modal"
import { userSettings } from "@/actions/user-settings"
import { UserSettingsSchema } from "@/schemas"
import {
    Form,
    FormField,
    FormControl,
    FormItem,
    FormLabel,
    FormDescription,
    FormMessage,
} from '@/components/ui/form'
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { useCurrentUser } from "@/hooks/use-current-user"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { UserRole } from "@prisma/client"
import { Switch } from "@/components/ui/switch"



export const UserSettingsModal = () => {

    const user = useCurrentUser()

    const { update } = useSession()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | undefined>()
    const [success, setSuccess] = useState<string | undefined>()
    
    const userSettingsModal = useUserSettingsModal()
    const form = useForm<z.infer<typeof UserSettingsSchema>>({
        resolver: zodResolver(UserSettingsSchema),
        defaultValues: {
            name: user?.name || undefined,
            email: user?.email || undefined,
            password: undefined,
            newPassword: undefined,
            role: user?.role || undefined,
            isTwoFactorEnabled: user?.isTwoFactorEnabled || undefined,
        }
    })
    
    const onSubmit = (values: z.infer<typeof UserSettingsSchema>) => {
        try {
            setLoading(true)
            userSettings(values)
                .then((data) => {
                    if (data.error) {
                        toast({
                            title: "Opps!",
                            description: data.error,
                            variant: "destructive",
                        })
                    }
                    if (data.success) {
                        update()
                        toast({
                            title: 'Success!',
                            description: data.success,
                            variant: 'success',
                        })
                    }
                })
        }
        catch (error) {
            toast({
                title: 'Error!',
                description: 'Something went wrong!',
                variant: "destructive",
            })
        }
        finally{
            setLoading(false)
        }
    }

    return (
        <Modal
            title='Settings'
            description="Make some changes into your account"
            isOpen={userSettingsModal.isSettingsOpen}
            onClose={userSettingsModal.onSettingsClose}
        >
            <Form {...form}>
                <form className='space-y-6' onSubmit={form.handleSubmit(onSubmit)}>
                    <div className='space-y-4'>
                        <FormField 
                            control={form.control}
                            name='name'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input 
                                            {...field}
                                            placeholder="John Doe"
                                            disabled={loading}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {user?.isOAuth === false && (
                        <>
                            <FormField 
                                control={form.control}
                                name='email'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input 
                                                {...field}
                                                placeholder="john.doe@example.com"
                                                type='email'
                                                disabled={loading}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField 
                                control={form.control}
                                name='password'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <Input 
                                                {...field}
                                                placeholder="******"
                                                type='password'
                                                disabled={loading}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField 
                                control={form.control}
                                name='newPassword'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>New Password</FormLabel>
                                        <FormControl>
                                            <Input 
                                                {...field}
                                                placeholder="******"
                                                type='password'
                                                disabled={loading}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </>
                        )}
                        <FormField 
                            control={form.control}
                            name='role'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Role</FormLabel>
                                    <Select
                                        disabled={loading}
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue 
                                                    placeholder="Select a role"
                                                />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value={UserRole.ADMIN}>
                                                ADMIN
                                            </SelectItem>
                                            <SelectItem value={UserRole.CUSTOMER}>
                                                CUSTOMER
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {user?.isOAuth === false && (
                        <FormField 
                            control={form.control}
                            name='isTwoFactorEnabled'
                            render={({ field }) => (
                                <FormItem 
                                    className='flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm'
                                >
                                    <div className='space-y-0.5'>
                                        <FormLabel>Two Factor Authentication</FormLabel>
                                        <FormDescription>
                                            Enable two factor authentication for your account
                                        </FormDescription>
                                    </div>
                                    <FormControl>
                                        <Switch 
                                            disabled={loading}
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        )}
                    </div>
                    <div className='pt-6 space-x-2 flex items-center justify-end w-full'>
                        <Button 
                            disabled={loading} 
                            variant='outline' 
                            onClick={userSettingsModal.onSettingsClose}
                        >
                            Cancel
                        </Button>
                        <Button 
                            disabled={loading}  
                            type='submit'
                        >
                            Save changes
                        </Button>
                    </div>
                </form>
            </Form>
        </Modal>
    )
}