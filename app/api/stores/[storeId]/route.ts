import { auth } from "@/auth"
import { db } from "@/lib/db"
import { NextResponse } from "next/server"

export async function PATCH (
    req: Request,
    { params }: { params: { storeId: string } }
) {
    try {
        const existedUser = await auth()
    
        if (!existedUser?.user.id) {
            return new NextResponse("Unauthenticated" , {status: 401})
        }

        const body = await req.json()

        const { name } = body

        if (!name) {
            return new NextResponse('Name is required', {status: 400})
        }

        if (!params.storeId) {
            return new NextResponse('Store Id is required' , { status: 400 })
        }

        const store = await db.store.updateMany({
            where: { 
                id: params.storeId,
                userId: existedUser.user.id,
             },
            data: {
                name,
            }
        })

        return NextResponse.json(store)

    } catch (error) {
        console.log('STORE_PATCH: ', error)
        return new NextResponse("Internal Error!", {status: 500})
    }
}

export async function DELETE (
    req: Request,
    { params }: { params: { storeId: string } }
) {
    try {
        const existedUser = await auth()
    
        if (!existedUser?.user.id) {
            return new NextResponse("Unauthenticated" , {status: 401})
        }

        if (!params.storeId) {
            return new NextResponse('Store Id is required' , { status: 400 })
        }

        const store = await db.store.deleteMany({
            where: { 
                id: params.storeId,
                userId: existedUser.user.id,
             },
        })

        return NextResponse.json(store)

    } catch (error) {
        console.log('STORE_DELETE: ', error)
        return new NextResponse("Internal Error!", {status: 500})
    }
}