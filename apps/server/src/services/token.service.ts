import jwt from "jsonwebtoken";
import moment from "moment";
import httpStatus from "http-status";
import config from "@/config/config";
import userService from "./user.service";
import ApiError from "@/utils/ApiError";
import { Moment } from "moment";
import { db } from "@/config/prisma";
import { TokenType, User } from "@prisma/client";

const generateToken = (
  userId: string,
  expires: Moment,
  type: TokenType,
  secret = config.jwt.secret,
) => {
  const payload = {
    sub: userId,
    iat: moment().unix(),
    exp: expires.unix(),
    type,
  };
  return jwt.sign(payload, secret);
};

const saveToken = async (
  token: string,
  userId: string,
  expires: Moment,
  type: TokenType,
  blacklisted = false,
) => {
  const tokenDoc = await db.token.create({
    data: {
      token,
      user: {
        connect: {
          id: userId,
        },
      },
      expires: expires.toDate(),
      type,
      blacklisted,
    },
  });
  return tokenDoc;
};

/**
 * Verify token and return token doc (or throw an error if it is not valid)
 */
const verifyToken = async (token: string, type: TokenType) => {
  const payload = jwt.verify(token, config.jwt.secret);
  const tokenDoc = await db.token.findFirst({
    where: {
      token,
      type,
      userId: String(payload.sub),
      blacklisted: false,
    },
  });
  if (!tokenDoc) {
    throw new Error("Token not found");
  }
  return tokenDoc;
};

const generateAuthTokens = async (user: User) => {
  const accessTokenExpires = moment().add(
    config.jwt.accessExpirationMinutes,
    "minutes",
  );
  const accessToken = generateToken(
    user.id,
    accessTokenExpires,
    TokenType.ACCESS
  );

  const refreshTokenExpires = moment().add(
    config.jwt.refreshExpirationDays,
    "days",
  );
  const refreshToken = generateToken(
    user.id,
    refreshTokenExpires,
    TokenType.REFRESH,
  );
  await saveToken(
    refreshToken,
    user.id,
    refreshTokenExpires,
    TokenType.REFRESH,
  );

  return {
    access: {
      token: accessToken,
      expires: accessTokenExpires.toDate(),
    },
    refresh: {
      token: refreshToken,
      expires: refreshTokenExpires.toDate(),
    },
  };
};

const generateResetPasswordToken = async (email: string) => {
  const user = await userService.getUserByEmail(email);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "No users found with this email");
  }
  const expires = moment().add(
    config.jwt.resetPasswordExpirationMinutes,
    "minutes",
  );
  const resetPasswordToken = generateToken(
    user.id,
    expires,
    TokenType.RESET_PASSWORD,
  );
  await saveToken(
    resetPasswordToken,
    user.id,
    expires,
    TokenType.RESET_PASSWORD,
  );
  return resetPasswordToken;
};

const generateVerifyEmailToken = async (user: User) => {
  const expires = moment().add(
    config.jwt.verifyEmailExpirationMinutes,
    "minutes",
  );
  const verifyEmailToken = generateToken(
    user.id,
    expires,
    TokenType.VERIFY_EMAIL,
  );
  await saveToken(verifyEmailToken, user.id, expires, TokenType.VERIFY_EMAIL);
  return verifyEmailToken;
};

export default {
  generateToken,
  saveToken,
  verifyToken,
  generateAuthTokens,
  generateResetPasswordToken,
  generateVerifyEmailToken,
};
