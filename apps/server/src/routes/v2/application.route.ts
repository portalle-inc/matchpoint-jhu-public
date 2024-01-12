import { publicProcedure, router } from "@/config/trpc";
import auth from "@/middlewares/trpcAuth";
import applicationService from "@/services/application.service";
import ApiError from "@/utils/ApiError";
import formatPaginated from "@/utils/formatPaginated";
import * as applicationValidation from "@/validations/v2/application.validation";
import httpStatus from "http-status";

export const applicationRouter = router({
  getApplications: publicProcedure
    .use(auth("viewApplications"))
    .input(applicationValidation.getApplications)
    .query(async (opts) => {
      let applications;
      const getPaginatedApplicationsOption = {
        limit: opts.input.limit,
        page: opts.input.page,
      };
      switch (opts.ctx.user.role) {
        case "SPONSOR":
          applications = await applicationService.getPaginatedApplications(
            {
              projectId: opts.input.projectId,
              sponsorId: opts.ctx.user.id,
              studentId: opts.input.studentId,
            },
            getPaginatedApplicationsOption
          );
          break;
        case "STUDENT":
          applications = await applicationService.getPaginatedApplications(
            {
              projectId: opts.input.projectId,
              studentId: opts.ctx.user.id,
              sponsorId: opts.input.sponsorId,
            },
            getPaginatedApplicationsOption
          );
          break;
        default:
          throw new ApiError(httpStatus.FORBIDDEN, "Role not allowed");
      }
      return formatPaginated(applications);
    }),

  createApplication: publicProcedure
    .use(auth("createApplication"))
    .input(applicationValidation.createApplication)
    .mutation(async (opts) => {
      const application = await applicationService.createApplication({
        projectId: opts.input.projectId,
        studentId: opts.ctx.user.id,
        questionAnswers: opts.input.questionAnswers,
      });
      return application;
    }),

  updateApplication: publicProcedure
    .use(auth("updateApplication"))
    .input(applicationValidation.updateApplication)
    .mutation(async (opts) => {
      const application = await applicationService.updateApplicationById(
        opts.input.id,
        {
          status: opts.input.status,
          feedback: opts.input.feedback,
        }
      );
      return application;
    }),
});
