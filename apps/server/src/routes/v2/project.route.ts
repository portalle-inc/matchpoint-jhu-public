import { publicProcedure, router } from "@/config/trpc";
import auth from "@/middlewares/trpcAuth";
import * as projectService from "@/services/project.service";
import formatPaginated from "@/utils/formatPaginated";
import * as projectValidation from "@/validations/v2/project.validation";

export const projectRouter = router({
  getProjects: publicProcedure
    .input(projectValidation.getProjects)
    .query(async (opts) => {
      const projects = await projectService.getPaginatedProjects(
        {
          name: opts.input.name,
        },
        {
          limit: opts.input.limit,
          page: opts.input.page,
        }
      );
      return formatPaginated(projects);
    }),

  createProject: publicProcedure
    .use(auth("manageProjects"))
    .input(projectValidation.createProject)
    .mutation(async (opts) => {
      const project = await projectService.createProject(
        opts.input,
        opts.ctx.user.id
      );
      return project;
    }),

    /**
     * get project information
     * @param id project id
     */
  getProject: publicProcedure
    .input(projectValidation.getProject)
    .query(async (opts) => {
      const project = await projectService.getProject(opts.input.id);
      return project;
    }),

  deleteProject: publicProcedure
    .use(auth("manageProjects"))
    .input(projectValidation.deleteProject)
    .mutation(async (opts) => {
      const project = await projectService.deleteProject(
        opts.input.id,
        opts.ctx.user.id
      );
      return project;
    }),

  /**
   * Update project information
   */
  updateProject: publicProcedure
    .use(auth("manageProjects"))
    .input(projectValidation.updateProject)
    .mutation(async (opts) => {
      const project = await projectService.updateProject(
        opts.input.id,
        {
          name: opts.input.name,
          description: opts.input.description,
        },
        opts.ctx.user.id
      );
      return project;
    }),
  
  setFollowProject: publicProcedure
  .use(auth("followProjects"))
  .input(projectValidation.setFollowProject)
  .mutation(async (opts) => {
    const project = await projectService.setFollowProject(
      opts.input.projectId,
      opts.ctx.user.id,
      opts.input.follow
    );
    return project;
  }),

  isFollowing: publicProcedure
    .use(auth("followProjects"))
    .input(projectValidation.isFollowing)
    .query(async (opts) => {
      const found = await projectService.getPaginatedProjects(
        {
          id: opts.input.projectId,
          followers: {
            some: {
              userId: opts.ctx.user.id,
            }
          }
        },
        {}
      );
      // [0] is the array of projects
      return found[0].length > 0;
    }),
  
  createAnnouncement: publicProcedure
    .use(auth("manageProjects"))
    .input(projectValidation.createAnnouncement)
    .mutation(async (opts) => {
      const announcement = await projectService.createAnnouncement(
        opts.input.projectId,
        opts.input.title,
        opts.input.content,
        opts.ctx.user.id
      );
      return announcement;
    }),
    
});
