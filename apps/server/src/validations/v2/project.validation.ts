import { LocationType } from "@prisma/client";
import { termString } from "./custom.validation";
import { z } from "zod";

export const getProjects = z.object({
  name: z.string().optional(),
  // sponsorName: z.string().optional(),
  limit: z.number().int().min(1).default(10),
  page: z.number().int().min(1).default(1),
});

export const createProject = z.object({
  name: z.string().min(1),
  excerpt: z.string().optional(),
  description: z.string().optional(),
  // attributes
  applicationDeadline: z.date().optional(),
  startTerm: termString.optional(),
  locationType: z.nativeEnum(LocationType).optional(),
  majors: z.array(z.string()).optional(),
  applicationQuestions: z.array(z.string()).optional(),
});

export const getProject = z.object({
  id: z.string(),
});

export const deleteProject = z.object({
  id: z.string(),
});

export const updateProject = z.object({
  id: z.string(),
  name: z.string().min(1),
  excerpt: z.string().optional(),
  description: z.string().optional(),
  // attributes
  applicationDeadline: z.date().optional(),
  startTerm: termString.optional(),
  locationType: z.nativeEnum(LocationType).optional(),
  majors: z.array(z.string()).optional(),
  applicationQuestions: z.array(z.string()).optional(),
});

export const setFollowProject = z.object({
  follow: z.boolean(),
  projectId: z.string(),
});

export const isFollowing = z.object({
  projectId: z.string(),
});

export const createAnnouncement = z.object({
  projectId: z.string(),
  title: z.string(),
  content: z.string(),
});

