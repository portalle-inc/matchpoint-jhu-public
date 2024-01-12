import ApiError from '@/utils/ApiError';
import toTRPCErrorCode from '@/utils/toTRPCErrorCode';
import { initTRPC } from '@trpc/server';
import * as trpcExpress from '@trpc/server/adapters/express';

export const createContext = ({
  req,
  res,
}: trpcExpress.CreateExpressContextOptions) => {
  const authorization = req.headers.authorization;
  return {
    authorization
  };
};
export type Context = Awaited<ReturnType<typeof createContext>>;

const t = initTRPC.context<Context>().create({
  errorFormatter(opts) {
    const { shape, error } = opts;
    if (error.cause instanceof ApiError) {
      return {
        ...shape,
        data: {
          ...shape.data,
          code: toTRPCErrorCode(error.cause.statusCode),
          httpStatus: error.cause.statusCode,
        },
      };
    }
    return shape;
  }
});

export const middleware = t.middleware;
export const router = t.router;
export const publicProcedure = t.procedure;

