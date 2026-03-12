import { Router } from "express";
import userController from "./user.controller.js";
import { authMiddleware } from "../../middleware/auth.middleware.js";
import { catchAsync } from "../../utils/catchAsync.js";
import { Role } from "../../generated/prisma/enums.js";

const router = Router()

router.get('/me',authMiddleware(),catchAsync(userController.aboutMe))

router.get('/',authMiddleware(Role.ADMIN),catchAsync(userController.getAllUsers))

router.patch('/:id',authMiddleware(Role.ADMIN),catchAsync(userController.updateUserStatus))

router.post("/update",authMiddleware(),catchAsync(userController.updateUserProfile))

export default router