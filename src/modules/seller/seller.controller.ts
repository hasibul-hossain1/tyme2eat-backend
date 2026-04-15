import { RequestHandler } from "express";
import sellerService from "./seller.service.js";
import { ApiError } from "../../utils/ApiError.js";

const signUpAsProvider: RequestHandler = async (req, res) => {
  if (!req.body.email || !req.body.password || !req.body.name) {
    throw new ApiError(400, "Missing required fields");
  }
  const data = await sellerService.signUpAsProvider({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });
  res.status(201).json({
    success: true,
    data,
    message: "Seller Account created successfully",
  });
};

const getSingleSellerWithMenu: RequestHandler = async (req, res) => {
  const id = req.params.id as string;
  const data = await sellerService.getSingleSellerWithMenu(id);
  res.status(200).json({
    success: true,
    data,
    message: "Retrieved single seller with menu successfully",
  });
};

const getAllSellers: RequestHandler = async (req, res) => {
  const data = await sellerService.getAllSellers();
  res.status(200).json({
    success: true,
    data,
    message: "Retrieved All Sellers successfully",
  });
};

const addMeal: RequestHandler = async (req, res) => {
  const userId = req.user.id;
  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }
  const data = await sellerService.addMeal({
    mealData: {
      name: req.body.name,
      price: req.body.price,
      description: req.body?.description,
      categoryId: req.body.categoryId,
      imageUrl: req.body.imageUrl,
    },
    userId,
  });
  res.json({
    success: true,
    data,
    message: "Meal added successfully",
  });
};

const updateMeal: RequestHandler = async (req, res) => {
  const userId = req.user.id;
  const isAdmin = req.user.role === "ADMIN";
  const mealId = req.params.id;

  const data = await sellerService.updateMeal(
    mealId as string,
    userId,
    isAdmin,
    req.body,
  );
  res.status(200).json({
    success: true,
    data,
    message: "Meal updated successfully",
  });
};

const deleteMeal: RequestHandler = async (req, res) => {
  const userId = req.user.id;
  const isAdmin = req.user.role === "ADMIN";
  const orderId = req.params.id;

  const data = await sellerService.deleteMeal(
    orderId as string,
    userId,
    isAdmin,
  );
  res.status(200).json({
    success: true,
    data,
    message: "Meal deleted successfully",
  });
};

const updateOrderStatus: RequestHandler = async (req, res) => {
  const userId = req.user.id;
  const orderId = req.params.id;
  const status = req.body.status;

  const data = await sellerService.updateOrderStatus(
    orderId as string,
    userId,
    status,
  );
  res.status(200).json({
    success: true,
    data,
    message: "Order status updated successfully",
  });
}

const myMeals: RequestHandler = async (req, res) => {
  const userId = req.user.id;
  const data = await sellerService.myMeals({ userId });
  res.status(200).json({
    success: true,
    data,
    message: "Retrieved my meals successfully",
  });
};

const getAllOrder:RequestHandler= async (req,res) => {
  const userId = req.user.id
  const data = await sellerService.getAllOrder({userId})
  res.json({
    success:true,
    data,
    message:"Retrieved all orders successfully"
  })
}

const updateSellerProfile:RequestHandler = async (req,res) => {
  const userId = req.user.id
  const data = await sellerService.updateSellerProfile({userId,payload:req.body})
  res.json({
    success:true,
    data,
    message:"Updated seller profile successfully"
  })
}

const getMySellerProfile:RequestHandler = async (req,res) => {
  const userId = req.user.id
  const data = await sellerService.getMySellerProfile({userId})
  res.json({
    success:true,
    data,
    message:"Retrieved my seller profile successfully"
  })
}


export default {
  signUpAsProvider,
  getAllSellers,
  getSingleSellerWithMenu,
  addMeal,
  updateMeal,
  deleteMeal,
  updateOrderStatus,
  myMeals,
  getAllOrder,
  updateSellerProfile,
  getMySellerProfile
};
