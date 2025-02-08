import { Prisma } from "@prisma/client"
import { FileUploadHelper } from "../../../helpers/fileUploadHelper"
import { paginationHelpers } from "../../../helpers/paginationHelper"
import { IUploadFile } from "../../../interfaces/file"
import { IPaginationOptions } from "../../../interfaces/pagination"
import prisma from "../../../shared/prisma"
import { IInventory, IInventorySearchField } from "./inventory.interface"
import { inventorySearchField } from "./inventory.const"

const createProductInInventory = async (payload: IInventory, file: IUploadFile) => {

    if (file) {
        const upload = await FileUploadHelper.uploadToCloudinary(file)
        payload.image = upload?.secure_url
    }

    const result = await prisma.inventory.create({
        data: payload
    })

    return result

}

const getProductFromInventory = async (filters: IInventorySearchField, options: IPaginationOptions) => {

    const { limit, page, skip, sortBy, sortOrder } = paginationHelpers.calculatePagination(options)
    let { searchTerm, ...remaining } = filters as Record<string, any>;

    if ('buyPrice' in remaining) remaining.buyPrice = Number(remaining.buyPrice);
    if ('sellPrice' in remaining) remaining.sellPrice = Number(remaining.sellPrice);

    const andConditions: Prisma.InventoryWhereInput[] = []

    if (searchTerm) {
        andConditions.push({
            OR: inventorySearchField.map((field) => ({
                [field]: {
                    contains: searchTerm,
                    mode: "insensitive"
                }
            }))
        })
    }

    if (Object.keys(remaining).length > 0) {
        andConditions.push({
            OR: Object.keys(remaining).map((field) => ({
                [field]: {
                    equals: remaining[field]
                }
            }))
        })
    }

    const whereConditions: Prisma.InventoryWhereInput = andConditions.length > 0 ? { AND: andConditions } : {}

    const result = await prisma.inventory.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: sortBy && sortOrder
            ? { [sortBy]: sortOrder }
            : { createdAt: 'desc' }
    })

    const total = await prisma.inventory.count({
        where: whereConditions
    })

    return {
        meta: {
            total,
            page,
            limit
        },
        data: result
    }

}

const updateProductInInventory = async (id: string, payload: Partial<IInventory>, file: IUploadFile) => {

    if (file) {
        const upload = await FileUploadHelper.uploadToCloudinary(file)
        payload.image = upload?.secure_url
    }

    const result = await prisma.inventory.update({
        where: {
            id
        },
        data: payload
    })

    return result
}

const deleteProductInInventory = async (id: string) => {

    const result = await prisma.inventory.delete({
        where: {
            id
        }
    })

    return result
}

export const inventoryService = {
    createProductInInventory,
    getProductFromInventory,
    updateProductInInventory,
    deleteProductInInventory
}