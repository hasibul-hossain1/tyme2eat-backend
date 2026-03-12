import { Router } from "express";
import sellerController from "./seller.controller.js";
import { catchAsync } from "../../utils/catchAsync.js";
import { authMiddleware } from "../../middleware/auth.middleware.js";
import { Role } from "../../generated/prisma/enums.js";

const router = Router()


router.get('/orders',authMiddleware(Role.SELLER),catchAsync(sellerController.getAllOrder))

router.post('/create-account',catchAsync(sellerController.signUpAsProvider))

router.get("/meals",authMiddleware(Role.SELLER),catchAsync(sellerController.myMeals))

router.get('/',catchAsync(sellerController.getAllSellers))

router.get('/:id',catchAsync(sellerController.getSingleSellerWithMenu))

router.post("/meals",authMiddleware(Role.SELLER),catchAsync(sellerController.addMeal))

router.patch("/meals/:id",authMiddleware(Role.SELLER,Role.ADMIN),catchAsync(sellerController.updateMeal))

router.delete("/meals/:id",authMiddleware(Role.SELLER,Role.ADMIN),catchAsync(sellerController.deleteMeal))

router.patch("/orders/:id",authMiddleware(Role.SELLER),catchAsync(sellerController.updateOrderStatus))




export default router