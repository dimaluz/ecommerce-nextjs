import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { SettingsForm } from "./components/settings-form";



interface SettingsPageProps {
    params: {
        storeId: string,
    }
}

const SettingsPage: React.FC<SettingsPageProps> = async ({ params }) => {

    const existedUser = await auth();

    if (!existedUser?.user.id) {
        redirect('/auth/login')
    }

    const store = await db.store.findFirst({
        where: {
            id: params.storeId,
            userId: existedUser?.user.id,
        }
    })

    if (!store) {
        redirect('/dashboard')
    }

    return (
        <div className="flex-col">
            <div className='flex-1 space-y-4 p-8 pt-6'>
                <SettingsForm initialData={store} />
            </div>
        </div>
    )
}

export default SettingsPage;