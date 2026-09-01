import { Router } from "express";
import { catchAsync } from "../../utils/catchAsync";
import authController from "./auth.controller";
import { authMiddleware } from "../../middleware/auth.middleware";



const router = Router()

router.get("/me",authMiddleware(),catchAsync(authController.getMe))

router.post("/signup",catchAsync(authController.signUp))

router.post("/signin",catchAsync(authController.signIn))

router.post("/refresh-token",catchAsync(authController.refreshToken))

router.post("/logout",catchAsync(authController.logout))


export default router