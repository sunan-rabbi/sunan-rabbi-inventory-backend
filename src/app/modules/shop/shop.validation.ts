import { z } from "zod";

const createShopZodSchema = z.object({
    body: z.object({
        shopName: z.string()
    })
})

const updateShopZodSchema = z.object({
    body: z.object({
        shopName: z.string().optional()
    })
})

export const shopValidation = {
    createShopZodSchema,
    updateShopZodSchema
}