'use client'

import { useEffect, useState } from "react"

import { UserSettingsModal } from "@/components/modals/user-settings-modal"


export const UserSettingsModalProvider = () => {
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    if (!isMounted) return null;

    return (
        <>
            <UserSettingsModal />
        </>
    )
}