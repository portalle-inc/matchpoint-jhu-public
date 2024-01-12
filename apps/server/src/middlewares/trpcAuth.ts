import passport, { AuthenticateCallback } from "passport";
import httpStatus from "http-status";
import ApiError from "@/utils/ApiError";
import { roleRights } from "@/config/roles";
import { middleware } from "@/config/trpc";
import { User } from "@prisma/client";

type VerifyCallback = (
  resolve: (user: User) => void,
  reject: (err: ApiError) => void,
  requiredRights: string[]
) => AuthenticateCallback;

const verifyCallback: VerifyCallback =
  (resolve, reject, requiredRights) => async (err, user, info) => {
    if (err || info || !user) {
      return reject(
        new ApiError(httpStatus.UNAUTHORIZED, "Please authenticate")
      );
    }

    if (requiredRights.length) {
      // user is garanteed to be of User type
      // also a role is garanteed to have rights
      const userRights = roleRights[(user as User).role] as string[];
      const hasRequiredRights = requiredRights.every((requiredRight) =>
        userRights.includes(requiredRight)
      );
      if (!hasRequiredRights) {
        return reject(
          new ApiError(httpStatus.FORBIDDEN, "Forbidden - Role not allowed")
        );
      }
    }

    resolve(user as User);
  };

// safe === false (default): throw error
// safe === true: user = null
const getAuthMiddlewareWithSafeAs = (safe: boolean) => {
  const auth = (...requiredRights: string[]) =>
    middleware(async (opts) => {
      const { ctx, next } = opts;
      const fakeReq = {
        headers: {
          authorization: ctx.authorization,
        },
      };
      const fakeNext = () => {};
      return new Promise<User>((resolve, reject) => {
        passport.authenticate(
          "jwt",
          { session: false },
          verifyCallback(resolve, reject, requiredRights)
        )(fakeReq, undefined, fakeNext);
      })
        .then((val) => {
          return next({
            ctx: {
              ...ctx,
              user: val,
            },
          });
        })
        .catch((err) => {
          if (safe) {
            return next({
              ctx: {
                ...ctx,
                user: null,
              },
            });
          }
          throw err;
        });
    });
  return auth;
};

export default getAuthMiddlewareWithSafeAs(false);

export const safeAuth = getAuthMiddlewareWithSafeAs(true);
