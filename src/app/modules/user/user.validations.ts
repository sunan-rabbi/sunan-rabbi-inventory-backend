import { z } from 'zod';

const createAdmin = z.object({
  body: z.object({
    password: z.string(),
    admin: z.object({
      name: z.string(),
      number: z.string()
    })
  })
})
const createCustomer = z.object({
  body: z.object({
    password: z.string(),
    customer: z.object({
      name: z.string(),
      number: z.string()
    })
  })
})
const verifyUser = z.object({
  body: z.object({
    OTP: z.number().int()
  })
})

export const UserValidation = {
  createAdmin,
  createCustomer,
  verifyUser
};
