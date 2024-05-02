'use client'

import { useState, useEffect } from "react"

import { Modal } from "@/components/ui/modal"
import { Button } from "@/components/ui/button"
import { useLogoutModal } from "@/hooks/use-logout-modal"
import { logout } from "@/actions/logout"


export const LogoutModal = () => {

    const [loading, setLoading] = useState(false)
    
    
    const logoutModal = useLogoutModal()

    console.log(logoutModal.isLogoutOpen)


    const onConfirm = () => {
        try {
            setLoading(true)
            logout()
        }
        catch (error) {
            console.log(error)
        }
        finally{
            setLoading(false)
        }
    }

    return (
        <Modal
            title='Logout'
            description="Do you really want to Logout?"
            isOpen={logoutModal.isLogoutOpen}
            onClose={logoutModal.onLogoutClose}
        >
            <div className='pt-6 space-x-2 flex items-center justify-end w-full'>
                <Button disabled={loading} variant='outline' onClick={logoutModal.onLogoutClose}>
                    Cancel
                </Button>
                <Button disabled={loading} variant='destructive' onClick={onConfirm}>
                    Continue
                </Button>
            </div>
        </Modal>
    )
}