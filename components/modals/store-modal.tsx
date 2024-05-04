'use client'

import { useForm } from "react-hook-form"
import * as z from 'zod'
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"

import { useStoreModal } from "@/hooks/use-store-modal"
import { useToast } from "@/components/ui/use-toast"
import { Modal } from "@/components/ui/modal"
import { formSchema } from "@/schemas"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { CreateNewStore } from "@/actions/dashboard/stores/create-new-store"



export const StoreModal = () => {

    const { toast } = useToast()

    const storeModal = useStoreModal()
    const [loading, setLoading] = useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
        }
    })

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        //Create a new store
        try {
            setLoading(true)
            const response = await CreateNewStore(values)
            
            if (response.success) {
                window.location.assign(`/dashboard/${response.storeId}`)
            }

            if (response.error) {
                toast({
                    title: 'Error!',
                    description: response.error,
                    variant: "destructive",
                })
            }
    
        } catch (error) {
            toast({
                title: 'Opps!',
                description: 'Something went wrong!',
                variant: "destructive",
            })
        } finally {
            setLoading(false)
        }
        
    }

    return (
        <Modal
            title='Create Store'
            description="Add a new store to manage products and categories"
            isOpen={storeModal.isOpen}
            onClose={storeModal.onClose}
        >
            <div>
                <div className='space-y-4 py-2 pb-4'>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <FormField
                                control={form.control}
                                name='name'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Name
                                        </FormLabel>
                                        <FormControl>
                                            <Input 
                                                disabled={loading}
                                                placeholder="E-commerce"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className='pt-6 space-x-2 flex items-center justify-end w-full'>
                                <Button 
                                    variant='outline' 
                                    onClick={storeModal.onClose}
                                    disabled={loading}
                                >
                                    Cancel
                                </Button>
                                <Button 
                                    type='submit'
                                    disabled={loading}
                                >
                                    Continue
                                </Button>
                            </div>
                        </form>
                    </Form>
                </div>
            </div>
        </Modal>
    )
}