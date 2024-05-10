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

        const { 
            name,
            price,
            categoryId,
            sizeId,
            colorId,
            images,
            isFeatured,
            isArchive,
         } = body

        if (!name) {
            return new NextResponse('Name is required', {status: 400})
        }

        if (!images || !images.length ) {
            return new NextResponse('Images are required', {status: 400})
        }

        if (!price) {
            return new NextResponse('Price is required', {status: 400})
        }

        if (!categoryId) {
            return new NextResponse('Category is required', {status: 400})
        }

        if (!sizeId) {
            return new NextResponse('Size is required', {status: 400})
        }

        if (!colorId) {
            return new NextResponse('Color is required', {status: 400})
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

        const product = await db.product.create({
            data: {
                name,
                price,
                categoryId,
                sizeId,
                colorId,
                isFeatured,
                isArchive,
                images: {
                    createMany: {
                        data: [
                            ...images.map((image: { url: string}) => image)
                        ]
                    }
                },
                storeId: params.storeId
            }
        })

        return NextResponse.json(product)

    } catch (error) {
        console.log('Products_POST: ', error)
        return new NextResponse("Internal Error!", {status: 500})
    }
}

export async function GET (
    req: Request,
    { params }: { params: { storeId: string } }
) {
    try {

        const { searchParams } = new URL(req.url)
        const categoryId = searchParams.get('categoryId') || undefined
        const colorId = searchParams.get('colorId') || undefined
        const sizeId = searchParams.get('sizeId') || undefined
        const isFeatured = searchParams.get('isFeatured')

        if (!params.storeId) {
            return new NextResponse('Store ID is required', {status: 400})
        }

        const products = await db.product.findMany({
            where: {
                storeId: params.storeId,
                categoryId,
                colorId,
                sizeId,
                isFeatured: isFeatured ? true : undefined,
                isArchive: false,
            },
            include: {
                images: true,
                category: true,
                color: true,
                size: true,
            },
            orderBy: {
                createdAt: 'desc'
            }
        })

        return NextResponse.json(products)

    } catch (error) {
        console.log('Products_GET: ', error)
        return new NextResponse("Internal Error!", {status: 500})
    }
}
