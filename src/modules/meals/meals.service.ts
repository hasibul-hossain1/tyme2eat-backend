import { Meal } from "../../generated/prisma/client.js";
import { MealWhereInput } from "../../generated/prisma/models.js";
import { prisma } from "../../lib/prisma.js";

const getAllMeals = async ({
  search,
  category,
  minPrice,
  maxPrice,
  sortBy,
  sortOrder,
  available,
  page,
  skip,
  take,
}: {
  search: string | undefined;
  category: string | undefined;
  minPrice: number | undefined;
  maxPrice: number | undefined;
  available: boolean | undefined;
  sortBy: string;
  sortOrder: "asc" | "desc";
  page: number;
  skip: number;
  take: number;
}) => {
  const andConditions: MealWhereInput[] = [];

  if (search) {
    andConditions.push({
      OR: [
        {
          foodName: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          description: {
            contains: search,
            mode: "insensitive",
          },
        },
      ],
    });
  }

  if (category) {
    andConditions.push({
      category: {
        name: category,
      },
    });
  }

  if (typeof available === "boolean") {
    andConditions.push({
      isAvailable: available,
    });
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    andConditions.push({
      price: {
        ...(minPrice && { gte: minPrice }),
        ...(maxPrice && { lte: maxPrice }),
      },
    });
  }

  const allMeal = await prisma.meal.findMany({
    where: {
      AND: andConditions,
    },
    take,
    skip,
    orderBy: {
      [sortBy]: sortOrder,
    },
    include: {
      _count: {
        select: {
          reviews: true,
        },
      },
      category: true,
    },
  });

  const totalMeal = await prisma.meal.count({
    where: {
      AND: andConditions,
    },
  });

  return {
    data: allMeal,
    pagination: {
      total: totalMeal,
      page,
      limit: take,
      totalPage: Math.ceil(totalMeal / take),
    },
  };
};

const getSingleMealById = async (id: string) => {
  const meal = await prisma.meal.findUniqueOrThrow({
    where: {
      id,
    },
    include: {
      category: {
        select: {
          name: true,
          imageUrl: true,
        },
      },
      reviews:{
        select:{
          id:true,
          rating:true,
          comment:true,
          createdAt:true,
          user:{
            select:{
              id:true,
              name:true,
              email:true,
              image:true,
            }
          }
        }
      },
      seller:true
    },
  });
  return meal;
};

const createReview = async (payload:{userId:string,mealId:string,rating:number,comment?:string}) => {
  const data = await prisma.$transaction(async (tx) => {
    //  await tx.orderItem.findFirstOrThrow({
    //   where:{
    //     mealId:payload.mealId,
    //     order:{
    //       userId:payload.userId
    //     }
    //   }
    // })

    const review = await tx.review.create({
      data:{
        userId:payload.userId,
        mealId:payload.mealId,
        rating:payload.rating,
        comment:payload.comment ?? null
      }
    })

    return review

  });
  return data;
};

const getAllCategories = async () => {
  const categories = await prisma.category.findMany()
  return categories;
};

const getCartMeals = async (payload:string[]) => {
  const data = await prisma.meal.findMany({
    where:{
      id:{
        in:payload
      }
    }
  })
  return data
}

export default {
  getAllMeals,
  getSingleMealById,
  createReview,
  getAllCategories,
  getCartMeals
};
