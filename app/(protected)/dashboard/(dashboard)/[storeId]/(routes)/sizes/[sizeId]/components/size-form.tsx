'use client'

import { Size } from "@prisma/client"
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
import { sizeSchema } from "@/schemas"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { AlertModal } from "@/components/modals/alert-modal"



interface SizeFormProps {
    initialData: Size | null,
}

type SizeFormValues = z.infer<typeof sizeSchema>

export const SizeForm: React.FC<SizeFormProps> = ({ initialData }) => {
    
    const params = useParams()
    const router = useRouter()

    const title = initialData ? 'Edit size' : 'Create size'
    const description = initialData ? 'Edit a size' : 'Add a new size'
    const toastMessage = initialData ? 'Size updated' : 'Size created'
    const action = initialData ? 'Save changes' : 'Create'

    const form = useForm<SizeFormValues>({
        resolver: zodResolver(sizeSchema),
        defaultValues: initialData || {
            name: '',
            value: '',
        },
    })

    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    const onSubmit = async (data: SizeFormValues) => {
        try {
            setLoading(true)
            if(initialData) {
                await axios.patch(`/api/${params.storeId}/sizes/${params.sizeId}`, data)
            }
            else {
                await axios.post(`/api/${params.storeId}/sizes`, data)
            }
            router.refresh()
            router.push(`/dashboard/${params.storeId}/sizes`)
            toast({
                title: 'Success!',
                description: toastMessage,
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
            await axios.delete(`/api/${params.storeId}/sizes/${params.sizeId}`)
            router.refresh()
            router.push(`/dashboard/${params.storeId}/sizes`)
            toast({
                title: 'Success!',
                description: 'Size was deleted.'
            })
        } catch (error) {
            toast({
                title: 'Error!',
                description: 'Make sure you removed all products using this size.'
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
                    title={title}
                    description={description}
                />
                {initialData && (
                    <Button
                    variant='destructive'
                    size='icon'
                    disabled={loading}
                    onClick={() => setOpen(true)}
                    >
                        <Trash className='h-4 w-4' />
                    </Button>
                )}
                
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
                                    <FormLabel>Size name</FormLabel>
                                    <FormControl>
                                        <Input 
                                            disabled={loading}
                                            placeholder="Size's name"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField 
                            control={form.control}
                            name='value'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Value</FormLabel>
                                    <FormControl>
                                        <Input 
                                            disabled={loading}
                                            placeholder="Size's value"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <Button disabled={loading} className='ml-auto' type='submit'>
                        {action}
                    </Button>
                </form>
            </Form>
            <Separator />
        </>
        
    )
}