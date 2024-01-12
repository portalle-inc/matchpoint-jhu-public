import { z } from "zod";
import { password, whitelistEmail } from "./custom.validation";
import { UserRole } from "@prisma/client";

const register = z.object({
  email: whitelistEmail,
  password: password,
  name: z.string(),
  role: z.nativeEnum(UserRole),
});

const login = z.object({
  email: z.string(),
  password: z.string(),
});

const logout = z.object({
  refreshToken: z.string(),
});

const refreshTokens = z.object({
  refreshToken: z.string(),
});

const forgotPassword = z.object({
    email: z.string().email(),
});

const resetPassword = z.object({
    token: z.string(),
    password,
});

const verifyEmail = z.object({
    token: z.string(),
});

export default {
  register,
  login,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  verifyEmail,
};
