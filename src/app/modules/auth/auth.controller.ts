import { Request, Response } from 'express';
import config from '../../../config';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { ILoginUserResponse, IRefreshTokenResponse } from './auth.interface';
import { AuthService } from './auth.service';

const loginUser = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.loginUser(req.body);
  const { refreshToken } = result;
  // set refresh token into cookie
  const cookieOptions = {
    secure: config.env === 'production',
    httpOnly: true,
  };

  res.cookie('refreshToken', refreshToken, cookieOptions);

  sendResponse<ILoginUserResponse>(res, {
    statusCode: 200,
    success: true,
    message: 'User logged in successfully !',
    data: {
      accessToken: result.accessToken,
    },
  });
});

const refreshToken = catchAsync(async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;

  const result = await AuthService.refreshToken(refreshToken);

  sendResponse<IRefreshTokenResponse>(res, {
    statusCode: 200,
    success: true,
    message: 'User logged in successfully !',
    data: result,
  });
});

const changePassword = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const { ...passwordData } = req.body;

  await AuthService.changePassword(user, passwordData);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: '',
    data: {
      status: 200,
      message: 'Password changed successfully!',
    },
  });
});

const forgotPass = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.forgotPass(req.body.number);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'check your phone for OTP',
    data: result
  });
});

const checkOTP = catchAsync(async (req, res) => {
  const token = req.headers.authorization || '';
  const OTP = req.body.OTP
  const result = await AuthService.checkOTP(token, OTP)

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Set your new password',
    data: result
  });
})

const resetPassword = catchAsync(async (req: Request, res: Response) => {
  const token = req.headers.authorization || '';

  await AuthService.resetPassword(token, req.body.newPassword);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Account recovered!',
    data: {
      status: 200,
      message: 'Password Reset Successfully',
    },
  });
});

export const AuthController = {
  loginUser,
  refreshToken,
  changePassword,
  forgotPass,
  resetPassword,
  checkOTP
};
