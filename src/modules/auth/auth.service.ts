import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../../utils/jwt";
import { ApiError } from "../../utils/ApiError";

const signUp = async ({
  name,
  email,
  password,
}: {
  name: string;
  email: string;
  password: string;
}) => {
  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (existingUser) {
    throw new ApiError(400, "User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  const accessToken = generateAccessToken({
    userId: user.id,
    email: user.email,
    role: user.role,
  });
  const refreshToken = generateRefreshToken({
    userId: user.id,
    email: user.email,
    role: user.role,
  });

  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  return { refreshToken, accessToken, user };
};

const signIn = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    throw new ApiError(400, "User not found");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new ApiError(400, "Invalid password");
  }

  const accessToken = generateAccessToken({
    userId: user.id,
    email: user.email,
    role: user.role,
  });
  const refreshToken = generateRefreshToken({
    userId: user.id,
    email: user.email,
    role: user.role,
  });

  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  return {
    refreshToken,
    accessToken,
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  };
};

const refreshTokens = async (token: string) => {
  const stored = await prisma.refreshToken.findUnique({
    where: { token },
  });


  if (!stored || stored.expiresAt < new Date()) {
    throw new ApiError(401, "Invalid refresh token");
  }

  const decoded = verifyRefreshToken(token);

  await prisma.refreshToken.delete({ where: { token } });

  const newAccessToken = generateAccessToken({
    userId: decoded.userId,
    email: decoded.email,
    role: decoded.role,
  });

  const newRefreshToken = generateRefreshToken({
    userId: decoded.userId,
    email: decoded.email,
    role: decoded.role,
  });

  await prisma.refreshToken.create({
    data: {
      token: newRefreshToken,
      userId: decoded.userId,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  return { accessToken: newAccessToken, refreshToken: newRefreshToken };
};

const logout = async (token: string) => {
  await prisma.refreshToken.delete({ where: { token } });
};


const getMe = async (userId:string) => {
    const user = await prisma.user.findUniqueOrThrow({
        where: {id:userId}
    })
    return user
}

export default {
  signUp,
  signIn,
  refreshTokens,
    logout,
    getMe

};
