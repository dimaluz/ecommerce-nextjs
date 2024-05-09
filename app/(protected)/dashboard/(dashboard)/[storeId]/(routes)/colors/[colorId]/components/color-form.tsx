'use client'

import { Color } from "@prisma/client"
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
import { colorSchema } from "@/schemas"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { AlertModal } from "@/components/modals/alert-modal"



interface ColorFormProps {
    initialData: Color | null,
}

type ColorFormValues = z.infer<typeof colorSchema>

export const ColorForm: React.FC<ColorFormProps> = ({ initialData }) => {
    
    const params = useParams()
    const router = useRouter()

    const title = initialData ? 'Edit color' : 'Create color'
    const description = initialData ? 'Edit a color' : 'Add a new color'
    const toastMessage = initialData ? 'Color updated' : 'Color created'
    const action = initialData ? 'Save changes' : 'Create'

    const form = useForm<ColorFormValues>({
        resolver: zodResolver(colorSchema),
        defaultValues: initialData || {
            name: '',
            value: '',
        },
    })

    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    const onSubmit = async (data: ColorFormValues) => {
        try {
            setLoading(true)
            if(initialData) {
                await axios.patch(`/api/${params.storeId}/colors/${params.colorId}`, data)
            }
            else {
                await axios.post(`/api/${params.storeId}/colors`, data)
            }
            router.refresh()
            router.push(`/dashboard/${params.storeId}/colors`)
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
            await axios.delete(`/api/${params.storeId}/colors/${params.colorId}`)
            router.refresh()
            router.push(`/dashboard/${params.storeId}/colors`)
            toast({
                title: 'Success!',
                description: 'Color was deleted.'
            })
        } catch (error) {
            toast({
                title: 'Error!',
                description: 'Make sure you removed all products using this color.'
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
                                    <FormLabel>Color name</FormLabel>
                                    <FormControl>
                                        <Input 
                                            disabled={loading}
                                            placeholder="Color's name"
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
                                        <div className='flex items-center gap-x-4'>
                                            <Input 
                                                disabled={loading}
                                                placeholder="Color's value"
                                                {...field}
                                            />
                                            <div 
                                                className='border p-4 rounded-full'
                                                style={{backgroundColor: field.value}}
                                            />
                                        </div>
                                        
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