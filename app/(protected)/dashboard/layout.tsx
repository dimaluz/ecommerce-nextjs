import { Toaster } from "@/components/ui/toaster";
import { ModalProvider } from "@/providers/modal-provider";

export default function RootDashboardLayout ({ children } : { children: React.ReactNode }) {
    return (
        <>
            <ModalProvider />
            {children}
            <Toaster />
        </>
    )
}