import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { AuthController } from './auth.controller';
import { AuthValidation } from './auth.validation';
import auth from '../../middlewares/auth';
import { UserRole } from '@prisma/client';
import { userRoutes } from '../user/user.routes';

const router = express.Router();

router.post(
    '/login',
    validateRequest(AuthValidation.loginZodSchema),
    AuthController.loginUser
);

router.post(
    '/refresh-token',
    validateRequest(AuthValidation.refreshTokenZodSchema),
    AuthController.refreshToken
);

router.post(
    '/change-password',
    auth(UserRole.ADMIN, UserRole.CUSTOMER),
    validateRequest(AuthValidation.changePasswordZodSchema),
    AuthController.changePassword
);
router.post(
    '/forget-password',
    validateRequest(AuthValidation.forgetPasswordZodSchema),
    AuthController.forgotPass
);
router.post(
    '/check-otp',
    validateRequest(AuthValidation.checkOTPZodSchema),
    AuthController.checkOTP
);

router.post(
    '/reset-password',
    validateRequest(AuthValidation.resetPasswordZodSchema),
    AuthController.resetPassword
);

export const AuthRoutes = router;