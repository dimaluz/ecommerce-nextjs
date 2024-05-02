'use client'

import { LogoutModal } from "@/components/modals/logout-modal"
import { useEffect, useState } from "react"




export const LogoutModalProvider = () => {
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    if (!isMounted) return null;

    return (
        <>
            <LogoutModal />
        </>
    )
}