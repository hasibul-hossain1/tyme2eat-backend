import { RequestHandler } from "express";
import orderService from "./order.service.js";
import { success } from "better-auth";

const createOrder: RequestHandler = async (req, res) => {
  const userId = req.user.id;
  const items = req.body.items;
  const address = req.body.address;
  const data = await orderService.createOrder({ items, address, userId });
  res.status(201).json({
    successes: true,
    data,
    message: "Order created successfully",
  });
};

const getMyAllOrders: RequestHandler = async (req, res) => {
  const id = req.user.id;
  const data = await orderService.getMyAllOrders(id);
  res.json({
    success: true,
    data,
    message: "All order retrieved successfully",
  });
};

const getOrderById: RequestHandler = async (req, res) => {
  const orderId = req.params.id as string;
  const userId = req.user.id as string;
  const data = await orderService.getOrderById({ orderId, userId });
  res.json({
    success: true,
    data,
    message: "All order retrieved successfully",
  });
};

const orderedByCurrentUser: RequestHandler = async (req, res) => {
  const userId = req.user.id;
  const mealId = req.params.id as string;
  const isOrdered = await orderService.orderedByCurrentUser({ mealId, userId });
  res.json({
    success: true,
    data: {isOrdered},
    message: "The Response Retrieved Successfully",
  });
};

export default {
  createOrder,
  getMyAllOrders,
  getOrderById,
  orderedByCurrentUser,
};
