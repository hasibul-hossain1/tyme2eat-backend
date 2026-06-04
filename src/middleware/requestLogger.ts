import { NextFunction, Request, Response } from "express";
import fs from "fs";

const logStream = fs.createWriteStream("request.log", { flags: "a" });

export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const startTime = process.hrtime.bigint();

  res.on("finish", () => {
    try {
      const endTime = process.hrtime.bigint();
      const responseTimeMs = Number(endTime - startTime) / 1_000_000;

      const logEntry = JSON.stringify({
        timestamp: new Date().toISOString(),
        method: req.method,
        endpoint: req.originalUrl,
        status: res.statusCode,
        responseTimeMs: Number(responseTimeMs.toFixed(2)),
        ip: req.ip,
        userAgent: req.get("user-agent") || "Unknown",
      });

      console.log(logEntry);
      logStream.write(logEntry + "\n");
    } catch (error) {
      console.error("Logging error:", error);
    }
  });

  next();
};