import { ApplicationStatus } from "@prisma/client";
import { z } from "zod";

export const getApplications = z.object({
  status: z.nativeEnum(ApplicationStatus),
  sponsorId: z.string().optional(),
  studentId: z.string().optional(),
  projectId: z.string().optional(),
  limit: z.number().int().min(1).default(10),
  page: z.number().int().min(1).default(1),
});

export const createApplication = z.object({
  projectId: z.string(),
  questionAnswers: z.record(z.string()).optional(),
});

export const updateApplication = z.object({
  id: z.string(),
  status: z.nativeEnum(ApplicationStatus),
  feedback: z.string().optional(),
});