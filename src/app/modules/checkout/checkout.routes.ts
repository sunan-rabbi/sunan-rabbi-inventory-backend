import express from 'express'
import { checkOutController } from './checkout.controller'

const router = express.Router()

router.post('/', checkOutController.createCheckOut)
router.get('/', checkOutController.getCheckOut)

export const checkoutRoutes = router