/*
  Warnings:

  - You are about to drop the column `content` on the `Project` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "LocationType" AS ENUM ('ONSITE', 'REMOTE', 'HYBRID');

-- AlterTable
ALTER TABLE "Project" DROP COLUMN "content",
ADD COLUMN     "applicationDeadline" TIMESTAMP(3),
ADD COLUMN     "excerpt" TEXT,
ADD COLUMN     "locationType" "LocationType",
ADD COLUMN     "majors" TEXT[],
ADD COLUMN     "startTerm" TEXT;

-- CreateTable
CREATE TABLE "ProjectAnnouncement" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProjectAnnouncement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ProjectToStudentUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ProjectToStudentUser_AB_unique" ON "_ProjectToStudentUser"("A", "B");

-- CreateIndex
CREATE INDEX "_ProjectToStudentUser_B_index" ON "_ProjectToStudentUser"("B");

-- AddForeignKey
ALTER TABLE "ProjectAnnouncement" ADD CONSTRAINT "ProjectAnnouncement_id_fkey" FOREIGN KEY ("id") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProjectToStudentUser" ADD CONSTRAINT "_ProjectToStudentUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProjectToStudentUser" ADD CONSTRAINT "_ProjectToStudentUser_B_fkey" FOREIGN KEY ("B") REFERENCES "StudentUser"("userId") ON DELETE CASCADE ON UPDATE CASCADE;
