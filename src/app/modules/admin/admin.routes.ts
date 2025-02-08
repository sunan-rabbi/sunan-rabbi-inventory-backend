import express, { NextFunction, Request, Response } from 'express'
import { adminController } from './admin.controller'
import { FileUploadHelper } from '../../../helpers/fileUploadHelper'
import validateRequest from '../../middlewares/validateRequest'
import { adminValidation } from './admin.validation'

const router = express.Router()

router.get('/', adminController.getAllAdmin)
router.get('/:id', adminController.getAdminByID)
router.delete('/:id', adminController.deleteAdmin)
router.put(
    '/:id',
    FileUploadHelper.upload.single('file'),
    (req: Request, res: Response, next: NextFunction) => {
        req.body = JSON.parse(req.body.data)
        next()
    },
    validateRequest(adminValidation.updateAdmin),
    adminController.updateAdmin
)

export const adminRouters = router