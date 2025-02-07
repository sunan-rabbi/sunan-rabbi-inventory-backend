import { z } from 'zod';

const updateCustomer = z.object({
    body: z.object({
        name: z.string()
    })
})

export const CustomerValidation = {
    updateCustomer
};
