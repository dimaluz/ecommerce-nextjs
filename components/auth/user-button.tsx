'use client'

import { FaUser } from 'react-icons/fa'
import { LogOutIcon } from 'lucide-react'
import { CogIcon } from 'lucide-react'

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
    Avatar,
    AvatarImage,
    AvatarFallback,
} from '@/components/ui/avatar'
import { useCurrentUser } from '@/hooks/use-current-user'
import { LogoutButton } from '@/components/auth/logout-button'
import { SettingsButton } from '@/components/auth/settings-button'
import { useLogoutModal } from '@/hooks/use-logout-modal'


export const UserButton = () => {

    const user = useCurrentUser()
    const logoutModal = useLogoutModal()

    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <Avatar>
                    <AvatarImage src={user?.image || undefined} />
                    <AvatarFallback className='bg-gray-300'>
                        <FaUser />
                    </AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='w-40' align="end">
                <SettingsButton>
                    <DropdownMenuItem>
                        <CogIcon className='mr-2 h-4 w-4'/>
                        Settings
                    </DropdownMenuItem>
                </SettingsButton>
                {/* <LogoutButton> */}
                    <DropdownMenuItem onClick={logoutModal.onLogoutOpen}>
                        <LogOutIcon className='mr-2 h-4 w-4' />
                        Logout
                    </DropdownMenuItem>
                {/* </LogoutButton> */}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}