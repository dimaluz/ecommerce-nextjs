import { redirect } from "next/navigation"

import { auth } from "@/auth"
import { UserButton } from "@/components/auth/user-button"
import { MainNav } from "@/components/dashboard/main-nav"

import { db } from "@/lib/db"
import StoreSwitcher from "@/components/dashboard/store-switcher"




const Navbar = async () => {

    const existedUser = await auth()

    if (!existedUser) {
        redirect('/auth/login')
    }

    const stores = await db.store.findMany({
        where: {userId: existedUser.user.id}
    })

    return (
        <div className='border-b'>
            <div className='flex h-16 items-center px-4'>
                <StoreSwitcher items={stores} />
                <MainNav className='mx-6' />
                <div className='ml-auto flex items-center space-x-4'>
                    UserButton
                    {/* <UserButton /> */}
                </div>
            </div>
        </div>
    )
}

export default Navbar