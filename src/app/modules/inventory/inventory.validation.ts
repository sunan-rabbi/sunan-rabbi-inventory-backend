import { z } from "zod";

const createProductZodSchema = z.object({
    body: z.object({
        productName: z.string(),
        barcode: z.string(),
        measuringUnit: z.string(),
        buyPrice: z.number(),
        sellPrice: z.number()
    })
})
const updateProductZodSchema = z.object({
    body: z.object({
        productName: z.string().optional(),
        barcode: z.string().optional(),
        measuringUnit: z.string().optional(),
        buyPrice: z.number().optional(),
        sellPrice: z.number().optional()
    })
})

export const inventoryZodSchema = {
    createProductZodSchema,
    updateProductZodSchema
}