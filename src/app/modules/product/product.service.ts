import prisma from "../../../shared/prisma"
import { IProduct } from "./product.interface"

const addProductInShop = async (payload: IProduct) => {

    await prisma.inventory.findUniqueOrThrow({
        where: {
            id: payload.productID
        }
    })

    await prisma.shop.findUniqueOrThrow({
        where: {
            id: payload.shopID
        }
    })


    const result = await prisma.productAmount.upsert({
        create: payload,
        update: {
            amount: {
                increment: payload.amount
            }
        },
        where: {
            productID_shopID: {
                productID: payload.productID,
                shopID: payload.shopID
            }
        }
    })

    return result

}

const deleteProductFromShop = async (productID: string, shopID: string) => {
    const deleted = await prisma.productAmount.delete({
        where: {
            productID_shopID: {
                productID,
                shopID
            }
        }
    })

    return deleted
}


const updateProductInShop = async (payload: IProduct) => {

    await prisma.inventory.findUnique({
        where: {
            id: payload.productID
        }
    })

    await prisma.shop.findUnique({
        where: {
            id: payload.shopID
        }
    })

    const result = await prisma.productAmount.update({
        data: {
            amount: payload.amount
        },
        where: {
            productID_shopID: {
                productID: payload.productID,
                shopID: payload.shopID
            }
        }
    })

    return result
}

export const productService = {
    addProductInShop,
    deleteProductFromShop,
    updateProductInShop
}