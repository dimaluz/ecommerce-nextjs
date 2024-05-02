import { auth } from "@/auth";
import { SessionProvider } from "next-auth/react";

import { Toaster } from "@/components/ui/toaster";
import { ModalProvider } from "@/providers/modal-provider";
import { LogoutModalProvider } from "@/providers/logout-modal-provider";


export default async function RootDashboardLayout ({ children } : { children: React.ReactNode }) {
    
    const session = await auth()
    
    return (
        <>
            <SessionProvider session={session}>
                <ModalProvider />
                <LogoutModalProvider />
                {children}
                <Toaster />
            </SessionProvider> 
        </>
    )
}