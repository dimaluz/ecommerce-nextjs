import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import Navbar from "@/components/dashboard/navbar";



export default async function DashboardLayout ({
    children,
    params,
}: {
    children: React.ReactNode, 
    params: {storeId: string},
}) {
    const existedUser = await auth();

    if (!existedUser) {
        redirect('/auth/login')
    }

    const store = await db.store.findFirst({
        where: {
            id: params.storeId,
            userId: existedUser.user.id,
        }
    })

    if (!store) {
        redirect('/dashboard')
    }

    return (
        <>
            <Navbar />
            {children}
        </>
    )
}