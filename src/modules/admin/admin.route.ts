import { Router } from "express";
import adminController from "./admin.controller";
import { catchAsync } from "../../utils/catchAsync";
import { authMiddleware } from "../../middleware/auth.middleware";
import { Role } from "../../generated/prisma/enums";

const router =Router()

router.post("/create-category",authMiddleware(Role.ADMIN),catchAsync(adminController.createCategory))

router.delete("/delete-category/:id",authMiddleware(Role.ADMIN),catchAsync(adminController.deleteCategory))

router.get("/all-meal",authMiddleware(Role.ADMIN),catchAsync(adminController.getAllOrder))


export default router