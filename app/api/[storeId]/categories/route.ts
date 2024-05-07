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

        const { name, billboardId } = body

        if (!name) {
            return new NextResponse('Category name is required', {status: 400})
        }

        if (!billboardId) {
            return new NextResponse('Billboard is required', {status: 400})
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

        const category = await db.category.create({
            data: {
                name,
                billboardId,
                storeId: params.storeId
            }
        })

        return NextResponse.json(category)

    } catch (error) {
        console.log('Categories_POST: ', error)
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

        const categories = await db.category.findMany({
            where: {
                storeId: params.storeId,
            }
        })

        return NextResponse.json(categories)

    } catch (error) {
        console.log('Categories_GET: ', error)
        return new NextResponse("Internal Error!", {status: 500})
    }
}
