'use client'

import { Billboard } from "@prisma/client"
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
import { billboardSchema } from "@/schemas"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { AlertModal } from "@/components/modals/alert-modal"
import { ApiAlert } from "@/components/dashboard/api-alert"
import { useOrigin } from "@/hooks/use-origin"
import ImageUpload from "@/components/dashboard/image-upload"


interface BillboardFormProps {
    initialData: Billboard | null,
}

type BillboardFormValues = z.infer<typeof billboardSchema>

export const BillboardForm: React.FC<BillboardFormProps> = ({ initialData }) => {
    
    const params = useParams()
    const router = useRouter()
    const origin = useOrigin()

    const title = initialData ? 'Edit billboard' : 'Create billboard'
    const description = initialData ? 'Edit a billboard' : 'Add a new billboard'
    const toastMessage = initialData ? 'Billboard updated' : 'Billboard created'
    const action = initialData ? 'Save changes' : 'Create'

    const form = useForm<BillboardFormValues>({
        resolver: zodResolver(billboardSchema),
        defaultValues: initialData || {
            label: '',
            imageUrl: '',
        },
    })

    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    const onSubmit = async (data: BillboardFormValues) => {
        try {
            setLoading(true)
            if(initialData) {
                await axios.patch(`/api/${params.storeId}/billboards/${params.billboardId}`, data)
            }
            else {
                await axios.post(`/api/${params.storeId}/billboards`, data)
            }
            router.refresh()
            router.push(`/dashboard/${params.storeId}/billboards`)
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
            await axios.delete(`/api/${params.storeId}/billboards/${params.billboardId}`)
            router.refresh()
            router.push('/dashboard')
            toast({
                title: 'Success!',
                description: 'Billboard was deleted.'
            })
        } catch (error) {
            toast({
                title: 'Error!',
                description: 'Make sure you removed all categories using this billboard.'
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
                    <FormField 
                        control={form.control}
                        name='imageUrl'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Background Image</FormLabel>
                                <FormControl>
                                    <ImageUpload 
                                        value={field.value ? [field.value] : []}
                                        disabled={loading}
                                        onChange={(url) => field.onChange(url)}
                                        onRemove={() => field.onChange('')}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className='grid grid-cols-3 gap-8'>
                        <FormField 
                            control={form.control}
                            name='label'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Label</FormLabel>
                                    <FormControl>
                                        <Input 
                                            disabled={loading}
                                            placeholder="Billboard label"
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