import { Prisma, UserRole } from "@prisma/client";
import { paginationHelpers } from "../../../helpers/paginationHelper";
import { JwtPayload } from "../../../interfaces/common";
import { IPaginationOptions } from "../../../interfaces/pagination";
import prisma from "../../../shared/prisma";

const createShop = async (user: JwtPayload, payload: { shopName: string }) => {
    // Verify the user is actually a Customer, or handle logic for Admin if needed
    const customer = await prisma.user.findUniqueOrThrow({
        where: {
            id: user.userID,
            role: user.role
        },
        include: {
            customer: true
        }
    });

    // Create the new shop, linking to the Customer's ID
    const result = await prisma.shop.create({
        data: {
            shopName: payload.shopName,
            ownerID: customer.customer?.id as string
        }
    });

    return result;
};

const getAllShop = async (
    user: JwtPayload,
    filters: { searchTerm?: string },
    options: IPaginationOptions
) => {
    const { limit, page, skip, sortBy, sortOrder } = paginationHelpers.calculatePagination(options);
    const { searchTerm } = filters;

    // We build up an array of AND conditions
    const andConditions: Prisma.ShopWhereInput[] = [];

    // If user is a CUSTOMER, only show shops belonging to that user
    if (user.role === UserRole.CUSTOMER) {
        // 1) Find the customer's ID (from the 'customers' table)
        const userData = await prisma.user.findUnique({
            where: { id: user.userID },
            select: {
                customer: {
                    select: { id: true }
                }
            }
        });
        if (!userData?.customer) {
            throw new Error("User does not have a customer record.");
        }
        // 2) Restrict the shops to only those owned by this customer's ID
        andConditions.push({
            ownerID: userData.customer.id
        });
    }
    // If user is an ADMIN, do nothing extra (i.e., see all shops)

    // Searching by shopName
    if (searchTerm) {
        andConditions.push({
            OR: ["shopName"].map((field) => ({
                [field]: {
                    contains: searchTerm,
                    mode: "insensitive"
                }
            }))
        });
    }

    // Searching by the owner's name or number (if needed)
    if (searchTerm) {
        andConditions.push({
            owner: {
                OR: ["name", "number"].map((field) => ({
                    [field]: {
                        contains: searchTerm,
                        mode: "insensitive"
                    }
                }))
            }
        });
    }

    const whereConditions: Prisma.ShopWhereInput =
        andConditions.length > 0 ? { AND: andConditions } : {};

    // Fetch shops
    const result = await prisma.shop.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: sortBy && sortOrder ? { [sortBy]: sortOrder } : { createdAt: "desc" }
    });

    // Count total shops (for pagination meta)
    const total = await prisma.shop.count({
        where: whereConditions
    });

    return {
        meta: {
            total,
            page,
            limit
        },
        data: result
    };
};

const deleteShop = async (user: JwtPayload, id: string) => {
    // If Admin, can delete any shop
    if (user.role === UserRole.ADMIN) {
        await prisma.shop.delete({
            where: { id }
        });
    }
    // If Customer, can only delete shops they own
    else if (user.role === UserRole.CUSTOMER) {
        // 1) Find the customer's ID
        const userData = await prisma.user.findUnique({
            where: { id: user.userID },
            select: {
                customer: {
                    select: { id: true }
                }
            }
        });
        if (!userData?.customer) {
            throw new Error("User does not have a customer record.");
        }

        // 2) Delete only if shop belongs to this customer
        await prisma.shop.deleteMany({
            where: {
                id,
                ownerID: userData.customer.id
            }
        });
    }
};

const updateShop = async (
    user: JwtPayload,
    id: string,
    payload: { shopName?: string }
) => {

    const userData = await prisma.user.findUnique({
        where: { id: user.userID },
        select: {
            customer: {
                select: { id: true }
            }
        }
    });

    if (!userData?.customer) {
        throw new Error("User does not have a customer record.");
    }

    const updateResult = await prisma.shop.update({
        where: {
            id,
            ownerID: userData.customer.id
        },
        data: payload
    });

    return updateResult;
}

export const shopService = {
    createShop,
    getAllShop,
    deleteShop,
    updateShop
};
