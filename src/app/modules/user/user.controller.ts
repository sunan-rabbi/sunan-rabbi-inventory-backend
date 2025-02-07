import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { UserServices } from './user.service';
import { IUploadFile } from '../../../interfaces/file';
import ApiError from '../../../errors/ApiError';
import { JWTHelper } from '../../../helpers/jwtHelpers';
import config from '../../../config';
import { Secret } from 'jsonwebtoken';

const createAdmin = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

  const file = req.file as IUploadFile;
  const result = await UserServices.createAdmin(req.body, file)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Admin created successfully!',
    data: result,
  });
});

const createCustomer = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

  const file = req.file as IUploadFile;
  const result = await UserServices.createCustomer(req.body, file)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Customer created successfully!',
    data: result,
  });
});

const getAllUser = catchAsync(async (req: Request, res: Response) => {

  const result = await UserServices.getAllUser();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Users retrieval successfully',
    data: result
  });
});
const verifyUser = catchAsync(async (req: Request, res: Response) => {

  const token = req.headers.authorization;
  if (!token) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'You are not authorized');
  }
  // verify token
  let verifiedUser = null;

  verifiedUser = JWTHelper.verifyToken(token, config.jwt.secret as Secret) as { number: string; userID: string; }

  const { OTP } = req.body

  const result = await UserServices.verifyUser(verifiedUser, OTP);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: '',
    data: result
  });
});



export const UserController = {
  createAdmin,
  createCustomer,
  getAllUser,
  verifyUser
};
