import { auth } from "@/auth"
import { db } from "@/lib/db"
import { NextResponse } from "next/server"


export async function GET (
    req: Request,
    { params }: { params: { categoryId: string } }
) {
    try {
        
        if (!params.categoryId) {
            return new NextResponse('Category Id is required' , { status: 400 })
        }

        const category = await db.category.findUnique({
            where: { 
                id: params.categoryId,
             },
             include: {
                billboard: true,
             }
        })

        return NextResponse.json(category)

    } catch (error) {
        console.log('Category_GET: ', error)
        return new NextResponse("Internal Error!", {status: 500})
    }
}

export async function PATCH (
    req: Request,
    { params }: { params: { storeId: string, categoryId: string } }
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

        if (!params.categoryId) {
            return new NextResponse('Category Id is required' , { status: 400 })
        }

        const storeByUserId = await db.store.findFirst({
            where: { 
                id: params.storeId,
                userId: existedUser.user.id,
             },
        })

        if (!storeByUserId) {
            return new NextResponse('Unauthorized' , { status: 403 })
        }

        const category = await db.category.updateMany({
            where: { 
                id: params.categoryId,
             },
             data: {
                name,
                billboardId,
             }
        })

        return NextResponse.json(category)

    } catch (error) {
        console.log('Category_PATCH: ', error)
        return new NextResponse("Internal Error!", {status: 500})
    }
}

export async function DELETE (
    req: Request,
    { params }: { params: { storeId: string, categoryId: string } }
) {
    try {
        const existedUser = await auth()
    
        if (!existedUser?.user.id) {
            return new NextResponse("Unauthenticated" , {status: 401})
        }

        if (!params.categoryId) {
            return new NextResponse('Category Id is required' , { status: 400 })
        }

        const storeByUserId = await db.store.findFirst({
            where: { 
                id: params.storeId,
                userId: existedUser.user.id,
             },
        })

        if (!storeByUserId) {
            return new NextResponse('Unauthorized' , { status: 403 })
        }

        const category = await db.category.deleteMany({
            where: { 
                id: params.categoryId,
             },
        })

        return NextResponse.json(category)

    } catch (error) {
        console.log('Category_DELETE: ', error)
        return new NextResponse("Internal Error!", {status: 500})
    }
}