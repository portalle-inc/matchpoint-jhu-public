import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import pagination from "prisma-extension-pagination";

const prisma = new PrismaClient();

export const db = prisma.$extends(pagination()).$extends({
  // Obfuscate password
  result: {
    user: {
      password: {
        needs: {},
        compute() {
          return "********";
        },
      },
    },
  },
  model: {
    user: {
      async isPasswordMatch(userId: string, password: string) {
        const user = await prisma.user.findFirst({
          where: {
            id: userId,
          },
        });
        if (!user || !user.password) {
          return false;
        }
        return await bcrypt.compare(password, user.password);
      },
    },
  },
});
