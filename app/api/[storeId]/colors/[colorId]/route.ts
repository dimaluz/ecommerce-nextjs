import { auth } from "@/auth"
import { db } from "@/lib/db"
import { NextResponse } from "next/server"


export async function GET (
    req: Request,
    { params }: { params: { colorId: string } }
) {
    try {
        
        if (!params.colorId) {
            return new NextResponse('Color Id is required' , { status: 400 })
        }

        const color = await db.color.findUnique({
            where: { 
                id: params.colorId,
             },
        })

        return NextResponse.json(color)

    } catch (error) {
        console.log('Color_GET: ', error)
        return new NextResponse("Internal Error!", {status: 500})
    }
}

export async function PATCH (
    req: Request,
    { params }: { params: { storeId: string, colorId: string } }
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

        if (!params.colorId) {
            return new NextResponse('Color Id is required' , { status: 400 })
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

        const color = await db.color.updateMany({
            where: { 
                id: params.colorId,
             },
             data: {
                name,
                value,
             }
        })

        return NextResponse.json(color)

    } catch (error) {
        console.log('Color_PATCH: ', error)
        return new NextResponse("Internal Error!", {status: 500})
    }
}

export async function DELETE (
    req: Request,
    { params }: { params: { storeId: string, colorId: string } }
) {
    try {
        const existedUser = await auth()
    
        if (!existedUser?.user.id) {
            return new NextResponse("Unauthenticated" , {status: 401})
        }

        if (!params.colorId) {
            return new NextResponse('Color Id is required' , { status: 400 })
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

        const color = await db.color.deleteMany({
            where: { 
                id: params.colorId,
             },
        })

        return NextResponse.json(color)

    } catch (error) {
        console.log('Color_DELETE: ', error)
        return new NextResponse("Internal Error!", {status: 500})
    }
}