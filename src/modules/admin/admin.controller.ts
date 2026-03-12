import { Request, RequestHandler, Response } from "express";
import adminService from "./admin.service";

const createCategory = async (req:Request,res:Response) => {
    const category = await adminService.createCategory(req.body)

    return res.status(201).json({
        success:true,
        data:category,
        message:"Category created successfully"
    })
}

const getAllOrder:RequestHandler= async (req,res) => {
    const data = await adminService.getAllOrder()
    res.json({
        success:true,
        data,
        message:"Retrieved all orders successfully"
    })
}

const deleteCategory:RequestHandler= async (req,res) => {
    const id = req.params.id as string
    const data = await adminService.deleteCategory({categoryId:id})
    res.json({
        success:true,
        data,
        message:"Category deleted successfully"
    })
}


export default {
    createCategory,
    getAllOrder,
    deleteCategory
}