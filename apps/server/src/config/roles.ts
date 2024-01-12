import { UserRole } from "@prisma/client";

const allRoles: { [key in UserRole]: ReadonlyArray<string> } = {
  SPONSOR: [
    "sponsor",
    "manageProjects",
    "viewApplications",
    "updateApplication",
  ],
  STUDENT: ["student", "viewApplications", "createApplication", "followProjects"],
} as const;

const roleRights = allRoles;

export { roleRights };
