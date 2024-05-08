import { auth } from "@/auth"
import { db } from "@/lib/db"
import { NextResponse } from "next/server"

export async function POST (
    req: Request,
    { params }: { params: { storeId: string } }
) {
    try {
        const existedUser = await auth()
    
        if (!existedUser?.user.id) {
            return new NextResponse("Unauthenticated" , {status: 401})
        }

        const body = await req.json()

        const { name, value } = body

        if (!name) {
            return new NextResponse('Name is required', {status: 400})
        }

        if (!value) {
            return new NextResponse('Value is required', {status: 400})
        }

        if (!params.storeId) {
            return new NextResponse('Store ID is required', {status: 400})
        }

        const storeByUserId = await db.store.findFirst({
            where: {
                id: params.storeId,
                userId: existedUser?.user.id,
            }
        })

        if (!storeByUserId) {
            return new NextResponse("Unauthorized" , {status: 403})
        }

        const size = await db.size.create({
            data: {
                name,
                value,
                storeId: params.storeId
            }
        })

        return NextResponse.json(size)

    } catch (error) {
        console.log('Sizes_POST: ', error)
        return new NextResponse("Internal Error!", {status: 500})
    }
}

export async function GET (
    req: Request,
    { params }: { params: { storeId: string } }
) {
    try {

        if (!params.storeId) {
            return new NextResponse('Store ID is required', {status: 400})
        }

        const sizes = await db.size.findMany({
            where: {
                storeId: params.storeId,
            }
        })

        return NextResponse.json(sizes)

    } catch (error) {
        console.log('Sizes_GET: ', error)
        return new NextResponse("Internal Error!", {status: 500})
    }
}
