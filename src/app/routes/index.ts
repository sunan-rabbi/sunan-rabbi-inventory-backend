import express from 'express';
import { userRoutes } from '../modules/user/user.routes';
import { AuthRoutes } from '../modules/auth/auth.routes';
import { adminRouters } from '../modules/admin/admin.routes';
import { customerRouters } from '../modules/customer/customer.routes';
import { shopRoutes } from '../modules/shop/shop.routes';

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
  {
    path: '/shop',
    route: shopRoutes,
  },
];

moduleRoutes.forEach(route => router.use(route.path, route.route));
export default router;
