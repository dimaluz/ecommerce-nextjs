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

        const { label, imageUrl } = body

        if (!label) {
            return new NextResponse('Label is required', {status: 400})
        }

        if (!imageUrl) {
            return new NextResponse('Image URL is required', {status: 400})
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

        const billboard = await db.billboard.create({
            data: {
                label,
                imageUrl,
                storeId: params.storeId
            }
        })

        return NextResponse.json(billboard)

    } catch (error) {
        console.log('Billboards_POST: ', error)
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

        const billboards = await db.billboard.findMany({
            where: {
                storeId: params.storeId,
            }
        })

        return NextResponse.json(billboards)

    } catch (error) {
        console.log('Billboards_GET: ', error)
        return new NextResponse("Internal Error!", {status: 500})
    }
}
