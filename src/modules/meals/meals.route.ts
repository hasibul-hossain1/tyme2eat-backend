import { Router } from "express";
import { catchAsync } from "../../utils/catchAsync.js";
import mealsController from "./meals.controller.js";
import { authMiddleware } from "../../middleware/auth.middleware.js";
import { Role } from "../../generated/prisma/enums.js";

const router = Router()


// for user
router.post("/cart",authMiddleware(Role.CUSTOMER),catchAsync(mealsController.getCartMeals))

router.get("/",catchAsync(mealsController.getAllMeals))

router.get("/categories",catchAsync(mealsController.getAllCategories))

router.get("/:id",catchAsync(mealsController.getSingleMealById))

router.post("/:id",authMiddleware(Role.CUSTOMER),catchAsync(mealsController.createReview))






export default router
