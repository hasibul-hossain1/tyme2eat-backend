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
  baseURL: config.frontend_url,
  basePath: "/api/auth",
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
  },
  trustedOrigins: ["http://localhost:3000", "https://tyme2eat.vercel.app"],
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
  advanced: {
    cookies: {
      session_token: {
        name: "session_token",
        attributes: {
          httpOnly: true,
          secure: true,
          sameSite: "none",
          partitioned: true,
        },
      },
      state: {
        name: "session_token",
        attributes: {
          httpOnly: true,
          secure: true,
          sameSite: "none",
          partitioned: true,
        },
      },
    },
  },
  plugins:[oAuthProxy()]
});
