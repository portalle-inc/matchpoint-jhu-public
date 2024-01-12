-- AlterTable
ALTER TABLE "Application" ADD COLUMN     "attachments" TEXT[],
ADD COLUMN     "feedback" TEXT;

-- AlterTable
ALTER TABLE "StudentUser" ADD COLUMN     "major" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "bio" TEXT,
ADD COLUMN     "profilePicture" TEXT;

-- CreateTable
CREATE TABLE "ProjectApplicationQuestion" (
    "id" TEXT NOT NULL,
    "question" TEXT NOT NULL,

    CONSTRAINT "ProjectApplicationQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApplicationQuestionAnswer" (
    "id" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "answer" TEXT NOT NULL,

    CONSTRAINT "ApplicationQuestionAnswer_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ProjectApplicationQuestion" ADD CONSTRAINT "ProjectApplicationQuestion_id_fkey" FOREIGN KEY ("id") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApplicationQuestionAnswer" ADD CONSTRAINT "ApplicationQuestionAnswer_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApplicationQuestionAnswer" ADD CONSTRAINT "ApplicationQuestionAnswer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "ProjectApplicationQuestion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
