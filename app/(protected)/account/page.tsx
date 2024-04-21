import { auth, signOut } from '@/auth'
import { Button } from '@/components/ui/button'

const AccountPage = async () => {

    const session = await auth()

    return (
        <div>
            <h1 className='mt-3 w-full text-center text-2xl'>
                Account Page
            </h1>
            
            {JSON.stringify(session)}

            <form 
                action={async () => {
                    'use server'
                    await signOut()
                }}
                className='mt-5'
            >
                <Button type='submit'>
                    Logout
                </Button>
            </form>

        </div>
    )
}

export default AccountPage