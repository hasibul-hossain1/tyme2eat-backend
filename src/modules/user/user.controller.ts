import { RequestHandler } from "express"
import userService from "./user.service.js"
import { ApiError } from "../../utils/ApiError.js"

const aboutMe:RequestHandler=async (req,res) => {
        const id = req.user.id
        const user = await userService.aboutMe(id)
        if (!user) {
            throw new ApiError(404,"User not found")
        }
        res.json({
            success:true,
            data:user,
            message:"User retrieved successfully"
        })
   
}

const getAllUsers:RequestHandler=async (req,res) => {
    const users = await userService.getAllUsers()
    res.json({
        success:true,
        data:users,
        message:"All users retrieved successfully"
    })
}

const updateUserStatus:RequestHandler = async (req,res) => {
    const id = req.params.id
    const status = req.body.status
    const user = await userService.updateUserStatus(id as string,status)
    if (!user) {
        throw new ApiError(404,"User not found")
    }
    res.json({
        success:true,
        data:user,
        message:"User status updated successfully"
    })
}

const updateUserProfile:RequestHandler = async (req,res) => {
    const id = req.user.id
    const name = req.body.name
    const image = req.body.image
    const update = await userService.updateUserProfile({userId:id,name,image})
    res.json({
        success:true,
        data:update,
        message:"User profile updated successfully"
    })
}

export default {
    aboutMe,
    getAllUsers,
    updateUserStatus,
    updateUserProfile
}