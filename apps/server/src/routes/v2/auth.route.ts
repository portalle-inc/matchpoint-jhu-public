import { router, publicProcedure, middleware } from "@/config/trpc";
import authService from "@/services/auth.service";
import tokenService from "@/services/token.service";
import userService from "@/services/user.service";
import ApiError from "@/utils/ApiError";
import toTRPCErrorCode from "@/utils/toTRPCErrorCode";
import authValidation from "@/validations/v2/auth.validation";
import { TRPCError } from "@trpc/server";
import httpStatus from "http-status";
import emailService from "@/services/email.service";
import auth, { safeAuth } from "@/middlewares/trpcAuth";

export const authRouter = router({
  login: publicProcedure.input(authValidation.login).mutation(async (opts) => {
    const { password, ...user } =
      await authService.loginUserWithEmailAndPassword(
        opts.input.email,
        opts.input.password
      );
    const tokens = await tokenService.generateAuthTokens({ ...user, password });
    return { user, tokens };
  }),

  logout: publicProcedure
    .input(authValidation.logout)
    .mutation(async (opts) => {
      await authService.logout(opts.input.refreshToken);
    }),

  register: publicProcedure
    .input(authValidation.register)
    .mutation(async (opts) => {
      const { password, ...user } = await userService.createUser(opts.input);
      const tokens = await tokenService.generateAuthTokens({
        ...user,
        password,
      });
      return { user, tokens };
    }),

  refreshTokens: publicProcedure
    .input(authValidation.refreshTokens)
    .mutation(async (opts) => {
      const tokens = await authService.refreshAuth(opts.input.refreshToken);
      return tokens;
    }),

  forgotPassword: publicProcedure
    .input(authValidation.forgotPassword)
    .mutation(async (opts) => {
      const resetPasswordToken = await tokenService.generateResetPasswordToken(
        opts.input.email
      );
      await emailService.sendResetPasswordEmail(
        opts.input.email,
        resetPasswordToken
      );
    }),

  resetPassword: publicProcedure
    .input(authValidation.resetPassword)
    .mutation(async (opts) => {
      await authService.resetPassword(opts.input.token, opts.input.password);
    }),

  sendVerificationEmail: publicProcedure.use(auth()).mutation(async (opts) => {
    const user = opts.ctx.user;
    const verifyEmailToken = await tokenService.generateVerifyEmailToken(user);
    await emailService.sendVerificationEmail(user.email, verifyEmailToken);
  }),

  verifyEmail: publicProcedure
    .input(authValidation.verifyEmail)
    .mutation(async (opts) => {
      await authService.verifyEmail(opts.input.token);
    }),

  getMe: publicProcedure.use(safeAuth()).query((opts) => {
    return opts.ctx.user;
  }),
});
