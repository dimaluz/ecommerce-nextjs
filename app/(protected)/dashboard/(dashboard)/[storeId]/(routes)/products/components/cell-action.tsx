'use client'

import axios from "axios"
import { Copy, Edit, MoreHorizontal, Trash } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { useState } from "react"

import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuItem, 
    DropdownMenuLabel, 
    DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { ProductColumn } from "./columns"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { AlertModal } from "@/components/modals/alert-modal"




interface CellActionProps {
    data: ProductColumn
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {

    const router = useRouter()
    const params = useParams()

    const [loading, setLoading] = useState(false)
    const [open, setOpen] = useState(false)

    const onCopy = (id: string) => {
        navigator.clipboard.writeText(id)
        toast({
            title: "Copied",
            description: "Product ID copied to the clipboard."
        })
    }

    const onDelete = async () => {
        try {
            setLoading(true)
            await axios.delete(`/api/${params.storeId}/products/${data.id}`)
            router.refresh()
            toast({
                title: 'Success!',
                description: 'Product was deleted.'
            })
        } catch (error) {
            toast({
                title: 'Error!',
                description: 'Something went wrong.'
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
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button className='h-8 w-8 p-0' variant='ghost'>
                        <span className='sr-only'>
                            Open menu
                        </span>
                        <MoreHorizontal className='h-4 w-4' />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>
                        Actions
                    </DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => onCopy(data.id)}>
                        <Copy className='mr-2 h-4 w-4' />
                        Copy ID
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push(`/dashboard/${params.storeId}/products/${data.id}`)}>
                        <Edit className='mr-2 h-4 w-4' />
                        Update
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setOpen(true)}>
                        <Trash className='mr-2 h-4 w-4' />
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
        
    )
}