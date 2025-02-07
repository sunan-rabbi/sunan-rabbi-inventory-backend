import bcrypt from 'bcrypt';
import httpStatus from 'http-status';
import { Secret } from 'jsonwebtoken';
import config from '../../../config';
import ApiError from '../../../errors/ApiError';
import {
    IChangePassword,
    ILoginUser,
    ILoginUserResponse,
    IRefreshTokenResponse,
} from './auth.interface';
import prisma from '../../../shared/prisma';
import { UserStatus } from '@prisma/client';
import { AuthUtils } from '../../../helpers/bcryptHelpers';
import { JWTHelper } from '../../../helpers/jwtHelpers';
import { JwtPayload } from '../../../interfaces/common';

function generateFourDigitNumber() {
    return Math.floor(1000 + Math.random() * 9000);
}

function generateRandomCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let code = '';
    for (let i = 0; i < 4; i++) {
        const randomIndex = Math.floor(Math.random() * chars.length);
        code += chars[randomIndex];
    }
    return code;
}


const loginUser = async (payload: ILoginUser): Promise<ILoginUserResponse> => {
    const { number, password } = payload;

    const isUserExist = await prisma.user.findUnique({
        where: {
            number,
            status: UserStatus.ACTIVE
        }
    });

    if (!isUserExist) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist');
    }

    if (
        isUserExist.password &&
        !(await AuthUtils.comparePasswords(password, isUserExist.password))
    ) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Password is incorrect');
    }

    const { id: userID, role } = isUserExist;

    const accessToken = JWTHelper.createToken(
        { userID, role },
        config.jwt.secret as Secret,
        config.jwt.expires_in as string
    );

    const refreshToken = JWTHelper.createToken(
        { userID, role },
        config.jwt.refresh_secret as Secret,
        config.jwt.refresh_expires_in as string
    );

    return {
        accessToken,
        refreshToken
    };
};

const refreshToken = async (token: string): Promise<IRefreshTokenResponse> => {

    let verifiedToken = null;
    try {
        verifiedToken = JWTHelper.verifyToken(
            token,
            config.jwt.refresh_secret as Secret
        );
    } catch (err) {
        throw new ApiError(httpStatus.FORBIDDEN, 'Invalid Refresh Token');
    }

    const { userID } = verifiedToken as JwtPayload;

    const isUserExist = await prisma.user.findUnique({
        where: {
            id: userID,
            status: UserStatus.ACTIVE
        }
    });
    if (!isUserExist) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist');
    }

    const newAccessToken = JWTHelper.createToken(
        {
            userId: isUserExist.id,
            role: isUserExist.role,
        },
        config.jwt.secret as Secret,
        config.jwt.expires_in as string
    );

    return {
        accessToken: newAccessToken,
    };
};

const changePassword = async (
    user: JwtPayload | null,
    payload: IChangePassword
): Promise<void> => {
    const { oldPassword, newPassword } = payload;

    const isUserExist = await prisma.user.findUnique({
        where: {
            id: user?.userID,
            status: UserStatus.ACTIVE
        }
    });

    if (!isUserExist) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist');
    }

    // checking old password
    if (
        isUserExist.password &&
        !(await AuthUtils.comparePasswords(oldPassword, isUserExist.password))
    ) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Old Password is incorrect');
    }

    const hashPassword = await AuthUtils.hashedPassword(newPassword);

    await prisma.user.update({
        where: {
            id: isUserExist.id
        },
        data: {
            password: hashPassword,
        }
    })
};

const forgotPass = async (number: string) => {

    const isUserExist = await prisma.user.findUnique({
        where: {
            number,
            status: UserStatus.ACTIVE
        }
    });

    if (!isUserExist) {
        throw new ApiError(httpStatus.BAD_REQUEST, "User does not exist!")
    }

    const OTP = generateFourDigitNumber()

    const result = await prisma.forgetRequest.create({
        data: {
            number: isUserExist.number,
            userID: isUserExist.id,
            OTP
        }
    })

    if (!result) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Try again")
    }

    const passResetToken = JWTHelper.createToken({ Id: result.id, number: isUserExist.number, userID: isUserExist.id }, config.jwt.secret as Secret, config.jwt.passwordResetTokenExpirationTime)


    return {
        token: passResetToken
    }

}

const checkOTP = async (token: string, OTP: number) => {

    const isVerified = JWTHelper.verifyToken(token, config.jwt.secret as Secret) as { Id: string, number: string, userID: string }

    if (!isVerified) {
        throw new ApiError(httpStatus.UNAUTHORIZED, "Something went wrong!")
    }

    const forgetRequest = await prisma.forgetRequest.findUnique({
        where: {
            id: isVerified.Id,
            number: isVerified.number,
            userID: isVerified.userID
        }
    })

    if (forgetRequest?.OTP !== OTP) {
        throw new ApiError(httpStatus.BAD_REQUEST, "OTP doesn't match")
    }

    const flag = generateRandomCode()

    await prisma.forgetRequest.update({
        where: {
            id: isVerified.Id,
            number: isVerified.number,
            userID: isVerified.userID
        },
        data: {
            isChecked: true,
            flag
        }
    })

    const payload = {
        id: isVerified.Id,
        number: isVerified.number,
        userID: isVerified.userID,
        flag
    }

    const setToken = JWTHelper.createToken(payload, config.jwt.secret as Secret, config.jwt.passwordResetTokenExpirationTime)


    return {
        token: setToken
    }
}

const resetPassword = async (token: string, newPassword: string) => {

    const isVerified = JWTHelper.verifyToken(token, config.jwt.secret as Secret) as { id: string, number: string, userID: string, flag: string }

    console.log(isVerified);


    if (!isVerified) {
        throw new ApiError(httpStatus.UNAUTHORIZED, "Something went wrong!")
    }

    const isChecked = await prisma.forgetRequest.findUniqueOrThrow({
        where: {
            id: isVerified.id,
            number: isVerified.number,
            userID: isVerified.userID,
            isChecked: true,
            flag: isVerified.flag
        }
    })

    if (!isChecked) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Try again")
    }

    const hashedPassword = await AuthUtils.hashedPassword(newPassword)

    await prisma.user.update({
        where: {
            id: isChecked.userID,
            number: isChecked.number
        },
        data: {
            password: hashedPassword
        }
    })

}

export const AuthService = {
    loginUser,
    refreshToken,
    changePassword,
    forgotPass,
    resetPassword,
    checkOTP
};