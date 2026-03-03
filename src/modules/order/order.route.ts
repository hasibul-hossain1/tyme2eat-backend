import { Router } from "express";
import { catchAsync } from "../../utils/catchAsync.js";
import orderController from "./order.controller.js";
import { authMiddleware } from "../../middleware/auth.middleware.js";
import { Role } from "../../generated/prisma/enums.js";

const router = Router()

router.post('/',authMiddleware(Role.CUSTOMER),catchAsync(orderController.createOrder))

router.get('/',authMiddleware(Role.CUSTOMER),catchAsync(orderController.getMyAllOrders))
// isThisNeeded
router.get('/:id',authMiddleware(Role.CUSTOMER),catchAsync(orderController.getOrderById))

router.get('/me/:id',authMiddleware(Role.CUSTOMER),catchAsync(orderController.orderedByCurrentUser))

export default router