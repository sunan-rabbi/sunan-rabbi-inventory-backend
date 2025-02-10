import { NextFunction, Request, Response } from "express"
import catchAsync from "../../../shared/catchAsync"
import { productService } from "./product.service"
import sendResponse from "../../../shared/sendResponse"
import httpStatus from "http-status"

const addProductInShop = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const result = await productService.addProductInShop(req.body)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Product is added into your shop's inventory",
        data: result
    })

})

const deleteProductFromShop = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const { productID, shopID } = req.body
    const result = await productService.deleteProductFromShop(productID, shopID)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Product is deleted from your shop's inventory",
        data: result
    })

})

const updateProductInShop = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const result = await productService.updateProductInShop(req.body)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Product is updated successfully",
        data: result
    })

})

export const productController = {
    addProductInShop,
    deleteProductFromShop,
    updateProductInShop
}