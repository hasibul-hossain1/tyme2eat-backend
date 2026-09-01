import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware.js";
import { Role } from "../../generated/prisma/enums.js";

const router = Router()

router.get("/",authMiddleware(Role.CUSTOMER),(req,res) => {
    console.log('got hit');
    res.json({message:"got hit"})
})

router.get("/q",async (req,res) => {
    const tags = req.query.tags as string | undefined

    console.log(tags);

    res.send({
        success:true,
        data:tags?.split(",").filter(Boolean)
    })
})

export default router