import { Category } from "../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

const createCategory = async (data: Partial<Category>) => {
  const category = await prisma.category.create({
    data: {
      name: data.name!,
      imageUrl: data.imageUrl!,
    },
  });

  return category;
};

const deleteCategory = async ({categoryId}:{categoryId:string}) => {
  const category = await prisma.category.delete({
    where:{
        id:categoryId
    }
  })
  return category;
};

const getAllOrder = async () => {
  const order = await prisma.order.findMany({
    include: {
      user: true,
      orderItems: {
        include: {
          meal: {
            include: {
              seller: true,
            },
          },
        },
      },
    },
  });
  return order;
};

export default {
  createCategory,
  getAllOrder,
  deleteCategory
};
