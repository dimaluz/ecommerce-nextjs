'use client'

import { useRouter } from "next/navigation"

interface SettingsButtonProps {
    children: React.ReactNode,
    asChild?: boolean,
}

export const SettingsButton = ({
    children,
    asChild,
}: SettingsButtonProps) => {

    const router = useRouter()


    // if (mode === 'modal') {
    //     return (
    //         <span></span>
    //     )
    // }

    const onClick = () => {
        console.log("Settings button clicked")
        // router.push('/auth/login')
    }

    return (
        <span onClick={onClick} className='cursor-pointer'>
            {children}
        </span>
    )
}