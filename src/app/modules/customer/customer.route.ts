import express, { NextFunction, Request, Response } from 'express'
import { FileUploadHelper } from '../../../helpers/fileUploadHelper'
import validateRequest from '../../middlewares/validateRequest'
import { CustomerValidation } from './customer.validation'
import { customerController } from './customer.controller'


const router = express.Router()

router.get('/', customerController.getAllCustomer)
router.get('/:id', customerController.getCustomerByID)
router.delete('/:id', customerController.deleteCustomer)
router.put(
    '/:id',
    FileUploadHelper.upload.single('file'),
    (req: Request, res: Response, next: NextFunction) => {
        req.body = JSON.parse(req.body.data)
        next()
    },
    validateRequest(CustomerValidation.updateCustomer),
    customerController.updateCustomer
)

export const customerRouters = router