
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { db } from "@/lib/db";



export default async function SetupLayout ({ children }:{ children: React.ReactNode}) {
    const existedUser = await auth()

    if (!existedUser) {
        redirect('/auth/login')
    }

    const store = await db.store.findFirst({
        where: { userId: existedUser.user.id }
    })

    if (store) {
        redirect(`/dashboard/${store.id}`)
    }

    return (
        <>
            {children}
        </>
    )
}