import express from 'express';
import { userRoutes } from '../modules/user/user.route';
import { AuthRoutes } from '../modules/auth/auth.routes';
import { adminRouters } from '../modules/admin/admin.route';
import { customerRouters } from '../modules/customer/customer.route';

const router = express.Router();

const moduleRoutes = [
  // ... routes
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/user',
    route: userRoutes,
  },
  {
    path: '/admin',
    route: adminRouters,
  },
  {
    path: '/customer',
    route: customerRouters,
  },
];

moduleRoutes.forEach(route => router.use(route.path, route.route));
export default router;
