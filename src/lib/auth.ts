import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma.js";
import { sendMail } from "../utils/mailer.js";
import config from "../config/index.js";
import { oAuthProxy } from "better-auth/plugins";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:5000",
  basePath: "/api/v1/auth",
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
  },
  trustedOrigins: [
    process.env.CLIENT_URL || "http://localhost:3000",
    "http://localhost:3000",
    "https://tyme2eat.vercel.app",
  ],
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5, // 5 minutes
    },
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      console.log("mail sent");
      await sendMail({ email: user.email, link: url });
    },
    sendOnSignUp: true,
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
      },
      isActive: {
        type: "boolean",
        required: false,
      },
    },
  },
  plugins: [oAuthProxy()],
});
