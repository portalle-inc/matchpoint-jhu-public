import httpStatus from "http-status";
// import User from "../models/user.model";
import ApiError from "@/utils/ApiError";
import { Prisma, UserRole } from "@prisma/client";
import { db } from "@/config/prisma";
import bcrypt from "bcryptjs";

const isEmailTaken = async (email: string, excludeUserId?: string) => {
  const user = await db.user.findFirst({
    where: {
      email,
      id: {
        not: excludeUserId,
      },
    },
  });
  return !!user;
};

const createUser = async (userBody: {
  email: string;
  password: string;
  name: string;
  role: UserRole;
}) => {
  if (await isEmailTaken(userBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Email already taken");
  }
  // related to isPasswordMatch() in config/prisma.ts
  const hashedPassword = await bcrypt.hash(userBody.password, 8);
  const user = await db.user.create({
    data: {
      email: userBody.email,
      password: hashedPassword,
      name: userBody.name,
      role: userBody.role,
    },
  });
  switch (user.role) {
    case "STUDENT":
      await db.studentUser.create({
        data: {
          userId: user.id,
        },
      });
      break;
    case "SPONSOR":
      await db.studentUser.create({
        data: {
          userId: user.id,
        },
      });
      break;
  }
  return user;
};

const queryUsers = async (
  filter: NonNullable<Prisma.UserFindManyArgs["where"]>
) => {
  const users = await db.user.findMany({
    where: filter,
  });
  return users;
};

const getUserById = async (id: string) => {
  const user = await db.user.findUnique({
    where: {
      id,
    },
  });
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }
  return user;
};

const getUserByEmail = async (email: string) => {
  const user = await db.user.findFirst({
    where: {
      email,
    },
  });
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }
  return user;
};

const updateUserById = async (
  userId: string,
  updateBody: Prisma.UserUpdateInput
) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }
  if (updateBody.email && (await isEmailTaken(updateBody.email as string, userId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Email already taken");
  }
  await db.user.update({
    where: {
      id: userId,
    },
    data: {
      ...updateBody,
    },
  });
  Object.assign(user, updateBody);
  return user;
};

const deleteUserById = async (userId: string) => {
  try {
    const user = await db.user.delete({
      where: {
        id: userId,
      },
    });
    return user;
  } catch (error) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }
};

export default {
  createUser,
  queryUsers,
  getUserById,
  getUserByEmail,
  updateUserById,
  deleteUserById,
};
