import { auth } from "@/auth"

const DashboardPage = async () => {

    const session = await auth()

    return (
        <div>
            <h1 className='mt-3 w-full text-center text-2xl'>
                Dashboard Page
            </h1>
            
            {JSON.stringify(session)}
        </div>
    )
}

export default DashboardPage