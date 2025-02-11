import { NextFunction, Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { checkOutService } from "./checkout.service";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";

const createCheckOut = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const result = await checkOutService.createCheckOut()

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Product is sold successfully!",
        data: result
    })

})

const getCheckOut = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const result = await checkOutService.getCheckOut()

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Checkout data is fetched successfully!",
        data: result
    })

})

export const checkOutController = {
    createCheckOut,
    getCheckOut
}