'use client'

import { Store } from "@prisma/client"
import { Trash } from "lucide-react"
import * as z from 'zod'
import axios from 'axios'
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useParams, useRouter } from "next/navigation"

import { Heading } from "@/components/dashboard/heading"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { settingsSchema } from "@/schemas"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { AlertModal } from "@/components/modals/alert-modal"
import { ApiAlert } from "@/components/dashboard/api-alert"


interface SettingsFormProps {
    initialData: Store,
}

type SettingsFormValues = z.infer<typeof settingsSchema>

export const SettingsForm: React.FC<SettingsFormProps> = ({ initialData }) => {
    
    const params = useParams()
    const router = useRouter()

    const form = useForm<SettingsFormValues>({
        resolver: zodResolver(settingsSchema),
        defaultValues: initialData,
    })

    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    const onSubmit = async (data: SettingsFormValues) => {
        try {
            setLoading(true)
            await axios.patch(`/api/stores/${params.storeId}`, data)
            router.refresh()
            toast({
                title: 'Success!',
                description: 'Store was successfully updated!'
            })
        } catch (error) {
            toast({
                title: 'Error!',
                description: 'Something went wrong!'
            })
        } finally {
            setLoading(false)
        }
    }

    const onDelete = async () => {
        try {
            setLoading(true)
            await axios.delete(`/api/stores/${params.storeId}`)
            router.refresh()
            router.push('/dashboard')
            toast({
                title: 'Success!',
                description: 'Store was deleted.'
            })
        } catch (error) {
            toast({
                title: 'Error!',
                description: 'Make sure you removed all products and categories first'
            })
        }
        finally {
            setLoading(false)
            setOpen(false)
        }
    }    

    return (
        <>
            <AlertModal 
                isOpen={open}
                onClose={() => setOpen(false)}
                onConfirm={onDelete}
                loading={loading}
            />
            <div className='flex items-center justify-between'>
                <Heading 
                    title='Settings'
                    description='Manage store preferences'
                />
                <Button
                    variant='destructive'
                    size='icon'
                    disabled={loading}
                    onClick={() => setOpen(true)}
                >
                    <Trash className='h-4 w-4' />
                </Button>
            </div>
            <Separator />
            <Form {...form}>
                <form 
                    onSubmit={form.handleSubmit(onSubmit)}
                    className='space-y-8 w-full'
                >
                    <div className='grid grid-cols-3 gap-8'>
                        <FormField 
                            control={form.control}
                            name='name'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input 
                                            disabled={loading}
                                            placeholder="Store name"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <Button disabled={loading} className='ml-auto' type='submit'>
                        Save changes
                    </Button>
                </form>
            </Form>
            <Separator />
            <ApiAlert 
                title='NEXT_PUBLIC_API_URL'
                description={`${origin}/api/${params.storeId}`}
                variant="public"
            />
        </>
        
    )
}