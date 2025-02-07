import { IUploadFile } from '../../../interfaces/file';
import { FileUploadHelper } from '../../../helpers/fileUploadHelper';
import { IAdmin, ICustomer } from './user.interface';
import prisma from '../../../shared/prisma';
import { AuthUtils } from '../../../helpers/bcryptHelpers';
import { UserRole, UserStatus } from '@prisma/client';

import { JWTHelper } from '../../../helpers/jwtHelpers';
import config from '../../../config';
import ApiError from '../../../errors/ApiError';
import httpStatus from 'http-status';

function generateFourDigitNumber() {
  return Math.floor(1000 + Math.random() * 9000);
}

const createAdmin = async (payload: IAdmin, file: IUploadFile) => {

  const { password, admin } = payload
  const hashPassword = await AuthUtils.hashedPassword(password)

  if (file) {
    const uploadedProfileImage = await FileUploadHelper.uploadToCloudinary(file);
    payload.admin.image = uploadedProfileImage?.secure_url;
  }

  const OTP = generateFourDigitNumber()

  const result = await prisma.$transaction(async tx => {

    const createUser = await tx.user.create({
      data: {
        number: admin.number,
        password: hashPassword,
        role: UserRole.ADMIN,
        OTP
      }
    })

    const createAdmin = await tx.admin.create({
      data: {
        userID: createUser.id,
        ...admin
      }
    })

    return createAdmin
  })

  return result
};

const createCustomer = async (payload: ICustomer, file: IUploadFile) => {

  const { password, customer } = payload
  const hashPassword = await AuthUtils.hashedPassword(password)

  if (file) {
    const uploadedProfileImage = await FileUploadHelper.uploadToCloudinary(file);
    payload.customer.image = uploadedProfileImage?.secure_url;
  }

  const OTP = generateFourDigitNumber()

  const result = await prisma.$transaction(async tx => {

    const createUser = await tx.user.create({
      data: {
        number: customer.number,
        password: hashPassword,
        role: UserRole.CUSTOMER,
        OTP
      }
    })

    const createCustomer = await tx.customers.create({
      data: {
        userID: createUser.id,
        ...customer
      }
    })

    return createCustomer
  })

  const JwtPayload = {
    number: result.number,
    userID: result.userID
  }

  const token = JWTHelper.createToken(JwtPayload, config.jwt.secret as string, config.jwt.passwordResetTokenExpirationTime)

  return {
    data: result,
    verifyToken: token
  };
};

const getAllUser = async () => {

  const result = await prisma.user.findMany({
    select: {
      id: true,
      number: true,
      role: true,
      status: true,
      createdAt: true,
      updatedAt: true
    }
  })

  return result
};

const verifyUser = async ({ number, userID }: { number: string, userID: string }, OTP: number) => {

  const isUserExist = await prisma.user.findUniqueOrThrow({
    where: {
      number,
      id: userID,
      status: UserStatus.PENDING
    }
  })

  if (isUserExist.OTP !== OTP) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "OTP doesn't match")
  }

  await prisma.user.update({
    where: {
      id: userID
    },
    data: {
      status: UserStatus.ACTIVE
    }
  })

  return {
    message: "User is verified"
  }
}

export const UserServices = {
  createAdmin,
  createCustomer,
  getAllUser,
  verifyUser
};
