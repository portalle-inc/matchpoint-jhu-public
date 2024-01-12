import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  /* ====================
    Create Institutions
  ==================== */
  const uci = await prisma.institution.upsert({
    where: { name: "University of California, Irvine" },
    update: {},
    create: {
      name: "University of California, Irvine",
      domain: "uci.edu",
    },
  });

  /* ====================
    Create Users
  ==================== */
  const studentUser = await prisma.user.upsert({
    where: { email: "test-student-1@uci.edu" },
    update: {},
    create: {
      email: "test-student-1@uci.edu",
      password: await bcrypt.hash("password1", 8),
      name: "Student1 Test",
      role: "STUDENT",
      institution: {
        connect: {
          name: "University of California, Irvine",
        },
      },
      studentUser: {
        create: {},
      },
    },
  });
  const sponsorUser = await prisma.user.upsert({
    where: { email: "test-sponsor-1@uci.edu" },
    update: {},
    create: {
      email: "test-sponsor-1@uci.edu",
      password: await bcrypt.hash("password1", 8),
      name: "Sponsor1 Test",
      role: "SPONSOR",
      sponsorUser: { create: {} },
    },
  });

  /* ====================
    Create Projects
  ==================== */
  const project = await prisma.project.create({
    data: {
      name: "Project 1",
      excerpt: "Project 1 excerpt",
      description: "Project 1 description",
      sponsorId: sponsorUser.id,
      locationType: "ONSITE",
    },
  });

  /* ====================
    Create Applications
  ==================== */
  // Can't use upsert because of unique constraint on studentId and projectId
  const application = await prisma.application.create({
    data: {
      studentId: studentUser.id,
      projectId: project.id,
      status: "PENDING",
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    // TODO: fix type
    // @ts-ignore
    process.exit(1);
  });
