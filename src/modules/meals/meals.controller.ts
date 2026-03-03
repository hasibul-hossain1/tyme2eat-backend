import { RequestHandler } from "express";
import mealsService from "./meals.service.js";
import { paginationSortingHelper } from "../../helper/paginationSortingHelper.js";
import { success } from "better-auth";

const getAllMeals: RequestHandler = async (req, res) => {
  const search = req.query.search as string | undefined;
  const category = req.query.category as string | undefined;
  const minPrice = req.query.minPrice ? Number(req.query.minPrice) : undefined;
  const maxPrice = req.query.maxPrice ? Number(req.query.maxPrice) : undefined;
  const sortBy = (req.query.sortBy as string) || "createdAt";
  const sortOrder = (req.query.sortOrder as "asc" | "desc") || "asc";
  const available =
    req.query.available === "true"
      ? true
      : req.query.available === "false"
        ? false
        : undefined;
  const { page, skip, take } = paginationSortingHelper(req.query);

  const allMeals = await mealsService.getAllMeals({
    search,
    available,
    category,
    minPrice,
    maxPrice,
    sortBy,
    sortOrder,
    page,
    skip,
    take,
  });
  res.json({
    success: true,
    data: allMeals,
    message: "Meals retrieved successfully",
  });
};

const getSingleMealById: RequestHandler = async (req, res) => {
  const id = req.params.id as string;
  const meal = await mealsService.getSingleMealById(id);

  res.json({
    success: true,
    data: meal,
    message: "Meals retrieved successfully",
  });
};

const createReview: RequestHandler = async (req, res) => {
  const mealId = req.params.id as string;
  const userId = req.user.id;
  const { rating, comment } = req.body;
  const review = await mealsService.createReview({
    mealId,
    userId,
    rating,
    comment,
  });
  res.json({
    success: true,
    data: review,
    message: "Review created successfully",
  });
};

const getAllCategories: RequestHandler = async (req, res) => {
  const categories = await mealsService.getAllCategories();
  res.json({
    success: true,
    data: categories,
    message: "Categories retrieved successfully",
  });
};

type CartMeal = {
  mealId: string;
  quantity: number;
};

const getCartMeals: RequestHandler = async (req, res) => {
  const cartMeals = req.body.items as CartMeal[];
  const cartMealsIds = cartMeals.map((item) => item.mealId);
  const cartMealData = await mealsService.getCartMeals(cartMealsIds);
  res.json({
    success: true,
    data: cartMealData,
    message: "Meals retrieved successfully",
  });
};

export default {
  getAllMeals,
  getSingleMealById,
  createReview,
  getAllCategories,
  getCartMeals
};
