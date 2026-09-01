import { Request, Response, NextFunction } from "express";
import { JwtPayload, verifyAccessToken } from "../utils/jwt";
import { prisma } from "../lib/prisma";
import { Role } from "../generated/prisma/enums";

export const authMiddleware = (...roles: Role[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    try {
      const decoded = verifyAccessToken(token) as JwtPayload;
      const user = await prisma.user.findUnique({
        where: {
          id: decoded.userId,
        },
        select: {
          id: true,
          email: true,
          role: true,
          isActive: true,
        },
      });

      if (!user || !user.isActive) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }

      if (roles.length > 0 && !roles.includes(user.role)) {
        return res.status(403).json({ success: false, message: "Forbidden" });
      }

      req.user = user;
      return next();
    } catch (error) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
  };
};

export const authenticate = authMiddleware;
