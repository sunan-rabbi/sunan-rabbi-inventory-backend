import { NextFunction, Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { shopService } from "./shop.service";
import { JwtPayload } from "../../../interfaces/common";
import pick from "../../../shared/pick";
import { paginationFields } from "../../../const";

const createShop = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const result = await shopService.createShop(req.user as JwtPayload, req.body)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Shop is created successfully",
        data: result
    })
})

const getAllShop = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const filters = pick(req.query, ['searchTerm'])
    const options = pick(req.query, paginationFields)

    const result = await shopService.getAllShop(req.user as JwtPayload, filters, options)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "All shop is fetched",
        data: result
    })
})

const deleteShop = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const { id } = req.params
    const result = await shopService.deleteShop(req.user as JwtPayload, id)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Shop is deleted",
        data: result
    })
})

const updateShop = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const { id } = req.params
    const result = await shopService.updateShop(req.user as JwtPayload, id, req.body)
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Shop is updated",
        data: result
    })
})

export const shopController = {
    createShop,
    getAllShop,
    deleteShop,
    updateShop
}