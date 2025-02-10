import { z } from "zod";

const createProductValidation = z.object({
    body: z.object({
        productID: z.string(),
        shopID: z.string(),
        amount: z.number()
    })
})
const deleteProductValidation = z.object({
    body: z.object({
        productID: z.string(),
        shopID: z.string()
    })
})

export const productZodSchema = {
    createProductValidation,
    deleteProductValidation
}