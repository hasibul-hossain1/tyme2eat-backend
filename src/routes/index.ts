import { Router } from "express";
import sellerRoute from "../modules/seller/seller.route.js";
import testRouter from "../modules/test/test.route.js";
import userRouter from "../modules/user/user.route.js";
import mealRouter from "../modules/meals/meals.route.js";
import orderRouter from "../modules/order/order.route.js"
import adminRouter from "../modules/admin/admin.route.js"
import authRouter from "../modules/auth/auth.route.js";

const router = Router();

type RouteType = {
  path: string;
  route: any;
};

const routes: RouteType[] = [
  {
    path: "/seller",
    route: sellerRoute,
  },
  {
    path: "/test",
    route: testRouter,
  },
  {
    path: "/user",
    route: userRouter,
  },
  {
    path: "/meals",
    route: mealRouter,
  },
  {
    path:"/orders",
    route:orderRouter
  },
  {
    path:"/admin",
    route:adminRouter
  },
  {
    path:"/auth",
    route:authRouter
  }
];

routes.forEach(({ path, route }) => {
  router.use(path, route);
});

export default router;
