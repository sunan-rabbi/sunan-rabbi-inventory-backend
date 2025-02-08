import express from 'express'
import { shopController } from './shop.controller'
import auth from '../../middlewares/auth'
import { UserRole } from '@prisma/client'
import validateRequest from '../../middlewares/validateRequest'
import { shopValidation } from './shop.validation'

const router = express.Router()

router.post('/', auth(UserRole.CUSTOMER), validateRequest(shopValidation.createShopZodSchema), shopController.createShop)
router.get('/', auth(UserRole.CUSTOMER, UserRole.ADMIN), shopController.getAllShop)
router.delete('/:id', auth(UserRole.CUSTOMER, UserRole.ADMIN), shopController.deleteShop)
router.put('/:id', auth(UserRole.CUSTOMER), validateRequest(shopValidation.updateShopZodSchema), shopController.updateShop)

export const shopRoutes = router
