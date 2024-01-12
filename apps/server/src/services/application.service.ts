import ApiError from "@/utils/ApiError";
import httpStatus from "http-status";
import { db } from "@/config/prisma";
import { ApplicationStatus, Prisma } from "@prisma/client";

interface ApplicationUpdateParams {
  status?: ApplicationStatus;
  feedback?: string;
}

const userSelectFields = Prisma.validator<Prisma.UserSelect>()({
  id: true,
  name: true,
  email: true,
  role: true,
  institution: true,
});

const applicationIncludeFields = Prisma.validator<Prisma.ApplicationInclude>()({
  student: {
    include: {
      user: {
        select: userSelectFields
      },
    },
  },
  project: {
    include: {
      sponsor: {
        include: {
          user: {
            select: userSelectFields
          },
        }
      },
    },
  },
  answers: {
    select: {
      id: true,
      question: {
        select: {
          id: true,
          question: true,
        }
      },
      answer: true,
    },
  }
});

const createApplication = async (applicationBody: {
  studentId: string;
  projectId: string;
  questionAnswers?: Record<string, string>;
}) => {
  return await db.application.create({
    data: {
      student: {
        connect: {
          userId: applicationBody.studentId,
        },
      },
      project: {
        connect: {
          id: applicationBody.projectId,
        },
      },
      answers: {
        create: Object.entries(applicationBody.questionAnswers || {}).map(
          ([questionId, answer]) => ({
            questionId,
            answer,
          })
        ),
      }
    },
  });
};

const getPaginatedApplications = async (
  filter: {
    studentId?: string;
    projectId?: string;
    sponsorId?: string;
  },
  options: {
    limit?: number;
    page?: number;
    // include?: {
    //   project?:
    //     | boolean
    //     | {
    //         sponsor: boolean;
    //       };
    //   student?: boolean;
    // };
  }
) => {
  const result = await db.application
    .paginate({
      where: {
        studentId: filter.studentId,
        projectId: filter.projectId,
        project: {
          sponsor: {
            userId: filter.sponsorId,
          },
        },
      },
      include: applicationIncludeFields
    })
    .withPages({
      limit: options.limit || 10,
      page: options.page || 1,
    });

  return result;
};

const getApplicationById = async (id: string) => {
  const application = await db.application.findUnique({
    where: {
      id,
    },
  });
  if (!application) {
    throw new ApiError(httpStatus.NOT_FOUND, "Application not found");
  }
  return application;
};

const getApplicationSponsor = async (id: string) => {
  return await db.application.findUnique({
    where: {
      id,
    },
    include: {
      project: {
        include: {
          sponsor: true,
        },
      },
    },
  });
};

const updateApplicationById = async (
  applicationId: string,
  updateBody: ApplicationUpdateParams
) => {
  return await db.application.update({
    where: {
      id: applicationId,
    },
    data: {
      status: updateBody.status,
      feedback: updateBody.feedback,
    },
  });
};

const deleteApplicationById = async (applicationId: string) => {
  return await db.application.delete({
    where: {
      id: applicationId,
    },
  });
};

export default {
  createApplication,
  getPaginatedApplications,
  getApplicationById,
  updateApplicationById,
  deleteApplicationById,
  getApplicationSponsor,
};
