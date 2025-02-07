import { z } from 'zod';

const loginZodSchema = z.object({
    body: z.object({
        number: z.string({
            required_error: 'Number is required',
        }),
        password: z.string({
            required_error: 'Password is required',
        }),
    }),
});

const refreshTokenZodSchema = z.object({
    cookies: z.object({
        refreshToken: z.string({
            required_error: 'Refresh Token is required',
        }),
    }),
});

const changePasswordZodSchema = z.object({
    body: z.object({
        oldPassword: z.string({
            required_error: 'Old password  is required',
        }),
        newPassword: z.string({
            required_error: 'New password  is required',
        }),
    }),
});

const forgetPasswordZodSchema = z.object({
    body: z.object({
        number: z.string({
            required_error: 'number  is required',
        })
    }),
});

const checkOTPZodSchema = z.object({
    body: z.object({
        OTP: z.number({
            required_error: 'OTP is required',
        })
    }),
});
const resetPasswordZodSchema = z.object({
    body: z.object({
        newPassword: z.string({
            required_error: 'password is required',
        })
    }),
});

export const AuthValidation = {
    loginZodSchema,
    refreshTokenZodSchema,
    changePasswordZodSchema,
    forgetPasswordZodSchema,
    checkOTPZodSchema,
    resetPasswordZodSchema
};