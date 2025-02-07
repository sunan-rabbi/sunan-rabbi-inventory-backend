import express, { NextFunction, Request, Response } from 'express';
import { UserController } from './user.controller';
import validateRequest from '../../middlewares/validateRequest';
import { FileUploadHelper } from '../../../helpers/fileUploadHelper';
import { UserValidation } from './user.validations';

const router = express.Router();

router.get(
  '/',
  UserController.getAllUser,
);


router.post(
  '/create-admin',
  FileUploadHelper.upload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data)
    next()
  },
  validateRequest(UserValidation.createAdmin),
  UserController.createAdmin
);

router.post(
  '/create-customer',
  FileUploadHelper.upload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data)
    next()
  },
  validateRequest(UserValidation.createCustomer),
  UserController.createCustomer
);

router.post('/verify-user', validateRequest(UserValidation.verifyUser), UserController.verifyUser)

export const userRoutes = router;
