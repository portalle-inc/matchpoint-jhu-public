import httpStatus from "http-status";
import tokenService from "./token.service";
import userService from "./user.service";
import ApiError from "@/utils/ApiError";
import { db } from "@/config/prisma";
import { TokenType } from "@prisma/client";

// Allow coupling to token model

const loginUserWithEmailAndPassword = async (
  email: string,
  password: string,
) => {
  const user = await userService.getUserByEmail(email);
  if (!(await db.user.isPasswordMatch(user.id, password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Incorrect email or password");
  }
  return user;
};

const logout = async (refreshToken: string) => {
  const refreshTokenDoc = await db.token.findFirst({
    where: {
      token: refreshToken,
      type: TokenType.REFRESH,
      blacklisted: false,
    },
  });
  if (!refreshTokenDoc) {
    throw new ApiError(httpStatus.NOT_FOUND, "Not found");
  }
  await db.token.delete({
    where: {
      id: refreshTokenDoc.id,
    },
  });
};

const refreshAuth = async (refreshToken: string) => {
  try {
    const refreshTokenDoc = await tokenService.verifyToken(
      refreshToken,
      TokenType.REFRESH,
    );
    const user = await userService.getUserById(refreshTokenDoc.userId);
    await db.token.delete({
      where: {
        id: refreshTokenDoc.id,
      },
    });
    return tokenService.generateAuthTokens(user);
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Please authenticate");
  }
};

const resetPassword = async (
  resetPasswordToken: string,
  newPassword: string,
) => {
  try {
    const resetPasswordTokenDoc = await tokenService.verifyToken(
      resetPasswordToken,
      TokenType.RESET_PASSWORD,
    );
    const user = await userService.getUserById(
      resetPasswordTokenDoc.userId,
    );
    await userService.updateUserById(user.id, { password: newPassword });
    await db.token.deleteMany({
      where: {
        userId: user.id,
        type: TokenType.RESET_PASSWORD,
      },
    });
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Password reset failed");
  }
};

const verifyEmail = async (verifyEmailToken: string) => {
  try {
    const verifyEmailTokenDoc = await tokenService.verifyToken(
      verifyEmailToken,
      TokenType.VERIFY_EMAIL,
    );
    const user = await userService.getUserById(
      verifyEmailTokenDoc.userId,
    );
    await db.token.deleteMany({
      where: {
        userId: user.id,
        type: TokenType.VERIFY_EMAIL,
      },
    });
    await userService.updateUserById(user.id, { isEmailVerified: true });
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Email verification failed");
  }
};

export default {
  loginUserWithEmailAndPassword,
  logout,
  refreshAuth,
  resetPassword,
  verifyEmail,
};
