import * as trpcExpress from "@trpc/server/adapters/express";
import { createContext, router } from "@/config/trpc";
import { authRouter } from "./auth.route";
import { projectRouter } from "./project.route";
import { applicationRouter } from "./application.route";
import { userRouter } from "./user.route";
import { TRPCError } from "@trpc/server";
import toTRPCErrorCode from "@/utils/toTRPCErrorCode";
import ApiError from "@/utils/ApiError";

export const appRouter = router({
  auth: authRouter,
  user: userRouter,
  project: projectRouter,
  application: applicationRouter
});

export type AppRouter = typeof appRouter;

export const trpcRouter = trpcExpress.createExpressMiddleware({
  router: appRouter,
  createContext
});
