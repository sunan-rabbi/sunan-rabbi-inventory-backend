import express from 'express'
import { productController } from './product.controller'
import validateRequest from '../../middlewares/validateRequest'
import { productZodSchema } from './product.validation'
import auth from '../../middlewares/auth'
import { UserRole } from '@prisma/client'

const router = express.Router()

router.post('/', auth(UserRole.CUSTOMER), validateRequest(productZodSchema.createProductValidation), productController.addProductInShop)
router.delete('/', auth(UserRole.CUSTOMER), validateRequest(productZodSchema.deleteProductValidation), productController.deleteProductFromShop)
router.put('/', auth(UserRole.CUSTOMER), validateRequest(productZodSchema.createProductValidation), productController.updateProductInShop)

export const productRoutes = router