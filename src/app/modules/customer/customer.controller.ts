import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import pick from "../../../shared/pick";
import { paginationFields } from "../../../const";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { IUploadFile } from "../../../interfaces/file";
import { customerService } from "./customer.service";

const getAllCustomer = catchAsync(async (req: Request, res: Response) => {

    const filters = pick(req.query, ['name', 'number', 'searchTerm'])
    const options = pick(req.query, paginationFields)

    const result = await customerService.getAllCustomer(filters, options)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Customer retrieval successfully",
        meta: result.meta,
        data: result.data
    })

})

const getCustomerByID = catchAsync(async (req, res) => {
    const { id } = req.params
    const result = await customerService.getCustomerByID(id)
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: " is found successfully",
        data: result
    })
})

const deleteCustomer = catchAsync(async (req, res) => {
    const { id } = req.params
    const result = await customerService.deleteCustomer(id)
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Customer is deleted successfully",
        data: result
    })
})

const updateCustomer = catchAsync(async (req, res) => {
    const { id } = req.params
    const file = req.file as IUploadFile;
    const result = await customerService.updateCustomer(id, req.body, file)
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Customer is created successfully",
        data: result
    })
})

export const customerController = {
    getAllCustomer,
    getCustomerByID,
    deleteCustomer,
    updateCustomer
}