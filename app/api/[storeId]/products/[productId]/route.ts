import { auth } from "@/auth"
import { db } from "@/lib/db"
import { NextResponse } from "next/server"


export async function GET (
    req: Request,
    { params }: { params: { productId: string } }
) {
    try {
        
        if (!params.productId) {
            return new NextResponse('Product Id is required' , { status: 400 })
        }

        const product = await db.product.findUnique({
            where: { 
                id: params.productId,
             },
             include: {
                images: true,
                category: true,
                size: true,
                color: true,
             },
        })

        return NextResponse.json(product)

    } catch (error) {
        console.log('Product_GET: ', error)
        return new NextResponse("Internal Error!", {status: 500})
    }
}

export async function PATCH (
    req: Request,
    { params }: { params: { storeId: string, productId: string } }
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
            colorId,
            sizeId,
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

        if (!params.productId) {
            return new NextResponse('Product Id is required' , { status: 400 })
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

        await db.product.update({
            where: { 
                id: params.productId,
             },
             data: {
                name,
                price,
                categoryId,
                colorId,
                sizeId,
                images: {
                    deleteMany:{},
                },
                isFeatured,
                isArchive,
             }
        })

        const product = await db.product.update({
            where: {
                id: params.productId,
            },
            data: {
                images: {
                    createMany: {
                        data: [
                            ...images.map((image : {url: string}) => image),
                        ]
                    }
                }
            }
        })

        return NextResponse.json(product)

    } catch (error) {
        console.log('Product_PATCH: ', error)
        return new NextResponse("Internal Error!", {status: 500})
    }
}

export async function DELETE (
    req: Request,
    { params }: { params: { storeId: string, productId: string } }
) {
    try {
        const existedUser = await auth()
    
        if (!existedUser?.user.id) {
            return new NextResponse("Unauthenticated" , {status: 401})
        }

        if (!params.productId) {
            return new NextResponse('Product Id is required' , { status: 400 })
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

        const product = await db.product.deleteMany({
            where: { 
                id: params.productId,
             },
        })

        return NextResponse.json(product)

    } catch (error) {
        console.log('Product_DELETE: ', error)
        return new NextResponse("Internal Error!", {status: 500})
    }
}