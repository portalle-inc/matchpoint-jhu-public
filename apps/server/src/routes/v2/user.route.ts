import { router, publicProcedure } from "@/config/trpc";
import userValidation from "@/validations/v2/user.validation";
import auth from "@/middlewares/trpcAuth";
import userService from "@/services/user.service";

export const userRouter = router({
  updateUser: publicProcedure
    .use(auth())
    .input(userValidation.updateUser)
    .mutation(({ input, ctx}) => {
      const newUser = userService.updateUserById(ctx.user.id, input);
      return newUser;
    }),
});
