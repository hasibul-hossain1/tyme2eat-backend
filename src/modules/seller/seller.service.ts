import { success } from "better-auth";
import { Meal } from "../../generated/prisma/client.js";
import { Role, Status } from "../../generated/prisma/enums.js";
import { auth } from "../../lib/auth.js";
import { prisma } from "../../lib/prisma.js";
import { ApiError } from "../../utils/ApiError.js";

const signUpAsProvider = async ({
  name,
  email,
  password,
}: {
  name: string;
  email: string;
  password: string;
}) => {
  const data = await auth.api.signUpEmail({
    body: {
      email: email,
      password: password,
      name: name,
    },
  });
  if (!data.user.id) {
    throw new Error("Unable to create seller account");
  }

  await prisma.$transaction(async (tx) => {
    const exists = await tx.seller.findUnique({
      where: { userId: data.user.id },
    });

    if (exists) {
      throw new Error("Seller profile already exists");
    }

    await tx.user.update({
      where: {
        id: data.user.id,
      },
      data: {
        role: Role.SELLER,
      },
    });

    await tx.seller.create({
      data: {
        userId: data.user.id,
      },
    });
  });
  const updatedUser = await prisma.user.findUnique({
    where: { id: data.user.id },
    include: { sellers: true },
  });
  return updatedUser;
};

const getAllSellers = async () => {
  const data = await prisma.seller.findMany();
  return data;
};

const getSingleSellerWithMenu = async (id: string) => {
  const data = await prisma.seller.findUniqueOrThrow({
    where: {
      id,
    },
    include: {
      meals: true,
    },
  });
  return data;
};

type addMealServiceInput = {
  userId: string;
  mealData: {
    name: string;
    price: number;
    description?: string;
    categoryId: string;
    imageUrl: string;
  };
};

const addMeal = async ({ mealData, userId }: addMealServiceInput) => {
  const data = await prisma.$transaction(async (tx) => {
    const seller = await tx.seller.findUniqueOrThrow({
      where: {
        userId,
      },
      select: {
        id: true,
      },
    });
    return await tx.meal.create({
      data: {
        foodName: mealData.name,
        price: mealData.price,
        description: mealData.description ?? null,
        sellerId: seller.id,
        categoryId: mealData.categoryId,
        imageUrl: mealData.imageUrl,
      },
    });
  });

  return data;
};

const updateMeal = async (
  mealId: string,
  userId: string,
  isAdmin: boolean,
  data: Partial<Meal>,
) => {
  const meal = await prisma.meal.findUniqueOrThrow({
    where: {
      id: mealId,
    },
    select: {
      sellerId: true,
    },
  });

  const seller = await prisma.seller.findUniqueOrThrow({
    where: {
      userId,
    },
    select: {
      id: true,
    },
  });

  if (!isAdmin && meal.sellerId !== seller.id) {
    throw new ApiError(401, "Unauthorized");
  }

  const updatedMeal = await prisma.meal.update({
    where: {
      id: mealId,
    },
    data,
  });
  return updatedMeal;
};

const deleteMeal = async (mealId: string, userId: string, isAdmin: boolean) => {
  const meal = await prisma.meal.findUniqueOrThrow({
    where: {
      id: mealId,
    },
    select: {
      sellerId: true,
    },
  });

  const seller = await prisma.seller.findUniqueOrThrow({
    where: {
      userId,
    },
    select: {
      id: true,
    },
  });

  if (!isAdmin && meal.sellerId !== seller.id) {
    throw new ApiError(401, "Unauthorized");
  }

  const deletedMeal = await prisma.meal.delete({
    where: {
      id: mealId,
    },
  });
  return deletedMeal;
};

const updateOrderStatus = async (
  orderId: string,
  userId: string,
  status: Status,
) => {
  const seller = await prisma.seller.findUniqueOrThrow({
    where: { userId },
    select: { id: true },
  });

  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
      orderItems: {
        some: {
          meal: { sellerId: seller.id },
        },
      },
    },
    select: { id: true },
  });

  if (!order) {
    throw new ApiError(401, "Unauthorized");
  }

  return prisma.order.update({
    where: { id: orderId },
    data: { status },
  });
};

const myMeals = async ({ userId }: { userId: string }) => {
  const data = await prisma.$transaction(async (tx) => {
    const seller = await tx.seller.findUniqueOrThrow({
      where: {
        userId,
      },
      select: {
        id: true,
      },
    });
    return await tx.meal.findMany({
      where: {
        sellerId: seller.id,
      },
      include:{
        category:{
          select:{
            name:true
          }
        }
      }
    });
  });
  return data
};

const getAllOrder = async ({userId}:{userId:string}) => {
  const seller = await prisma.seller.findUniqueOrThrow({
    where:{
      userId
    },
    select:{
      id:true
    }
  })
  
  return await prisma.order.findMany({
  where:{
      orderItems:{
        some:{
          meal:{
            sellerId:seller.id
          }
        }
      },
    },
    include:{
      user:{
        select:{
          name:true
        }
      }
    }
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
  getAllOrder
};
