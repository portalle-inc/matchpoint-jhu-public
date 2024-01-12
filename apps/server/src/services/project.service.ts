import httpStatus from "http-status";
import { db } from "@/config/prisma";
import ApiError from "@/utils/ApiError";
import { LocationType, Prisma } from "@prisma/client";
import emailService from "./email.service";

interface ProjectCreateParams {
  name: string;
  excerpt?: string;
  description?: string;
  applicationDeadline?: Date;
  startTerm?: string;
  locationType?: LocationType;
  majors?: string[];
  applicationQuestions?: string[];
}

interface ProjectUpdateParams {
  name?: string;
  excerpt?: string;
  description?: string;
  applicationDeadline?: Date;
  startTerm?: string;
  locationType?: LocationType;
  majors?: string[];
  applicationQuestions?: string[];
}

const projectIncludeFields = {
  sponsor: {
    select: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          institution: true,
        },
      },
    },
  },
  applicationQuestions: {
    select: {
      id: true,
      question: true,
    },
  }
};

const verifyProjectSponsor = async (projectId: string, sponsorId: string) => {
  const project = await db.project.findUnique({
    where: {
      id: projectId,
    },
    select: {
      sponsorId: true,
    },
  });
  if (!project) {
    throw new ApiError(httpStatus.NOT_FOUND, "Not found");
  }
  if (project.sponsorId !== sponsorId) {
    throw new ApiError(httpStatus.FORBIDDEN, "Forbidden");
  }
};

export const getPaginatedProjects = async (
  filter: Prisma.ProjectWhereInput,
  options: {
    limit?: number;
    page?: number;
  }
) => {
  const projects = await db.project
    .paginate({
      include: projectIncludeFields,
      where: filter,
    })
    .withPages({
      limit: options.limit || 10,
      page: options.page || 1,
    });
  return projects;
};

export const createProject = async (
  projectBody: ProjectCreateParams,
  sponsorId: string
) => {
  const project = await db.project.create({
    data: {
      name: projectBody.name,
      excerpt: projectBody.excerpt,
      description: projectBody.description,
      applicationDeadline: projectBody.applicationDeadline,
      startTerm: projectBody.startTerm,
      locationType: projectBody.locationType,
      majors: projectBody.majors,
      applicationQuestions: {
        create: projectBody.applicationQuestions?.map(question => ({question})),
      },
      sponsor: {
        connect: {
          userId: sponsorId,
        },
      },
    },
  });
  return project;
};

export const getProject = async (projectId: string) => {
  const project = await db.project.findUnique({
    where: {
      id: projectId,
    },
    include: projectIncludeFields,
  });
  if (!project) {
    throw new ApiError(httpStatus.NOT_FOUND, "Not found");
  }
  return project;
};

export const deleteProject = async (projectId: string, verifySponsorId?: string) => {
  const project = await db.project.delete({
    where: {
      id: projectId,
      sponsorId: verifySponsorId,
    },
  });
  return project;
};

export const updateProject = async (
  projectId: string,
  updateBody: ProjectUpdateParams,
  verifySponsorId?: string
) => {
  const project = await db.project.update({
    where: {
      id: projectId,
      sponsorId: verifySponsorId,
    },
    data: {
      name: updateBody.name,
      excerpt: updateBody.excerpt,
      description: updateBody.description,
      applicationDeadline: updateBody.applicationDeadline,
      startTerm: updateBody.startTerm,
      locationType: updateBody.locationType,
      majors: updateBody.majors,
      applicationQuestions: {
        create: updateBody.applicationQuestions?.map(question => ({question})),
      },
    },
  });
  return project;
};

export const setFollowProject = async (
  projectId: string,
  studentUserId: string,
  follow: boolean
) => {
  await db.project.update({
    where: {
      id: projectId,
    },
    data: {
      followers: {
        [follow ? "connect" : "disconnect"]: {
          userId: studentUserId,
        },
      },
    },
  });
}

const broadcastAnnouncement = async (announcementId: string) => {
  const announcement = await db.projectAnnouncement.findUnique({
    where: {
      id: announcementId,
    },
    select: {
      title: true,
      content: true,
      project: {
        select: {
          name: true,
          followers: {
            select: {
              user: {
                select: {
                  name: true,
                  email: true,
                },
              },
            },
          },
        },
      },
    },
  });
  if (!announcement) {
    throw new ApiError(httpStatus.NOT_FOUND, "Not found");
  }
  for (const follower of announcement.project.followers) {
    const subject = `New announcement from ${announcement.project.name}`;
    const text = `Dear ${follower.user.name},\n\n${announcement.title}\n\n${announcement.content}`;
    await emailService.sendEmail(follower.user.email, subject, text);
  }
}

export const createAnnouncement = async (
  projectId: string,
  title: string,
  content: string,
  verifySponsorId?: string
) => {
  if (verifySponsorId)
    await verifyProjectSponsor(projectId, verifySponsorId);
  const announcement = await db.projectAnnouncement.create({
    data: {
      title,
      content,
      project: {
        connect: {
          id: projectId,
        },
      },
    },
  });
  await broadcastAnnouncement(announcement.id);
  return announcement;
}