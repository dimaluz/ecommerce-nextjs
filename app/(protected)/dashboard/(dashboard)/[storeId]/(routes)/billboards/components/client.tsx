'use client'

import { Plus } from "lucide-react"
import { useParams, useRouter } from "next/navigation"

import { Heading } from "@/components/dashboard/heading"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"



export const BillboardClient = () => {

    const router = useRouter()
    const params = useParams()

    return (
        <>
            <div className='flex items-center justify-between'>
                <Heading 
                    title='Billboards (0)'
                    description='Manage billboards for your store'
                />
                <Button
                    variant='secondary'
                    size='sm'
                    onClick={() => router.push(`/dashboard/${params.storeId}/billboards/new`)}
                >
                    <Plus className='mr-2 h-4 w-4' />
                    Add New
                </Button>
            </div>
            <Separator />
        </>
    )
}