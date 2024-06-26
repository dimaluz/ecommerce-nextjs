import { auth } from "@/auth"
import { db } from "@/lib/db"
import { NextResponse } from "next/server"


export async function GET (
    req: Request,
    { params }: { params: { billboardId: string } }
) {
    try {
        
        if (!params.billboardId) {
            return new NextResponse('Billboard Id is required' , { status: 400 })
        }

        const billboard = await db.billboard.findUnique({
            where: { 
                id: params.billboardId,
             },
        })

        return NextResponse.json(billboard)

    } catch (error) {
        console.log('Billboard_GET: ', error)
        return new NextResponse("Internal Error!", {status: 500})
    }
}

export async function PATCH (
    req: Request,
    { params }: { params: { storeId: string, billboardId: string } }
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

        if (!params.billboardId) {
            return new NextResponse('Store Id is required' , { status: 400 })
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

        const billboard = await db.billboard.updateMany({
            where: { 
                id: params.billboardId,
             },
             data: {
                label,
                imageUrl,
             }
        })

        return NextResponse.json(billboard)

    } catch (error) {
        console.log('Billboard_PATCH: ', error)
        return new NextResponse("Internal Error!", {status: 500})
    }
}

export async function DELETE (
    req: Request,
    { params }: { params: { storeId: string, billboardId: string } }
) {
    try {
        const existedUser = await auth()
    
        if (!existedUser?.user.id) {
            return new NextResponse("Unauthenticated" , {status: 401})
        }

        if (!params.billboardId) {
            return new NextResponse('Billboard Id is required' , { status: 400 })
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

        const billboard = await db.billboard.deleteMany({
            where: { 
                id: params.billboardId,
             },
        })

        return NextResponse.json(billboard)

    } catch (error) {
        console.log('Billboard_DELETE: ', error)
        return new NextResponse("Internal Error!", {status: 500})
    }
}