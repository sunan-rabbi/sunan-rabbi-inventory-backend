import express, { NextFunction, Request, Response } from 'express'
import auth from '../../middlewares/auth'
import { UserRole } from '@prisma/client'
import { FileUploadHelper } from '../../../helpers/fileUploadHelper'
import validateRequest from '../../middlewares/validateRequest'
import { inventoryZodSchema } from './inventory.validation'
import { inventoryController } from './inventory.controller'

const router = express.Router()

router.post('/',
    auth(UserRole.ADMIN),
    FileUploadHelper.upload.single('file'),
    (req: Request, res: Response, next: NextFunction) => {
        req.body = JSON.parse(req.body.data)
        next()
    },
    validateRequest(inventoryZodSchema.createProductZodSchema),
    inventoryController.createProductInInventory
)

router.get('/', auth(UserRole.ADMIN), inventoryController.getProductFromInventory)
router.delete('/', auth(UserRole.ADMIN), inventoryController.deleteProductInInventory)

router.put('/',
    auth(UserRole.ADMIN),
    FileUploadHelper.upload.single('file'),
    (req: Request, res: Response, next: NextFunction) => {
        req.body = JSON.parse(req.body.data)
        next()
    },
    validateRequest(inventoryZodSchema.updateProductZodSchema),
    inventoryController.updateProductInInventory
)

export const inventoryRoutes = router