import { Customer, Prisma, UserStatus } from "@prisma/client"
import { paginationHelpers } from "../../../helpers/paginationHelper"
import { IPaginationOptions } from "../../../interfaces/pagination"
import prisma from "../../../shared/prisma"
import { IGenericResponse } from "../../../interfaces/common"
import { IUploadFile } from "../../../interfaces/file"
import { FileUploadHelper } from "../../../helpers/fileUploadHelper"
import { ICustomerFilterRequest } from "./customer.interface"

const getAllCustomer = async (filters: ICustomerFilterRequest, options: IPaginationOptions): Promise<IGenericResponse<Customer[]>> => {

    const { limit, page, skip, sortBy, sortOrder } = paginationHelpers.calculatePagination(options)
    const { searchTerm, ...filterData } = filters

    const andConditions = []

    if (searchTerm) {
        andConditions.push({
            OR: ['name', 'number'].map(field => ({
                [field]: {
                    contains: searchTerm,
                    mode: 'insensitive'
                }
            }))
        })
    }

    if (Object.keys(filterData).length > 0) {
        andConditions.push({
            AND: Object.keys(filterData).map(key => ({
                [key]: {
                    equals: (filterData as any)[key]
                }
            }))
        })
    }

    andConditions.push({
        isDeleted: false
    })

    const whereConditions: Prisma.CustomerWhereInput = andConditions.length > 0 ? { AND: andConditions } : {}

    const result = await prisma.customer.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: sortBy && sortOrder
            ? { [sortBy]: sortOrder }
            : { createdAt: 'desc' }
    })

    const total = await prisma.customer.count({
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
const getCustomerByID = async (id: string) => {

    const result = await prisma.customer.findUnique({
        where: {
            userID: id
        }
    })

    return result
}
const deleteCustomer = async (id: string) => {
    await prisma.$transaction(async tx => {

        await prisma.customer.update({
            where: {
                userID: id
            },
            data: {
                isDeleted: true,
            }
        })

        await prisma.user.update({
            where: {
                id
            },
            data: {
                status: UserStatus.DELETED
            }
        })

    })

    return {
        message: "Customer is deleted"
    }
}
const updateCustomer = async (id: string, payload: { name?: string, image?: string }, file: IUploadFile) => {

    if (file) {
        const uploadedProfileImage = await FileUploadHelper.uploadToCloudinary(file);
        payload.image = uploadedProfileImage?.secure_url;
    }

    const result = await prisma.customer.update({
        where: {
            userID: id
        },
        data: payload
    })

    return result
}

export const customerService = {
    getAllCustomer,
    getCustomerByID,
    deleteCustomer,
    updateCustomer
}