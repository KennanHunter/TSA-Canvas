/*
  Warnings:

  - Added the required column `fileObjectId` to the `AssignmentSubmission` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Assignment" ALTER COLUMN "dueAt" SET DATA TYPE TIMESTAMP(0);

-- AlterTable
ALTER TABLE "AssignmentSubmission" ADD COLUMN     "fileObjectId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "email" DROP NOT NULL,
ALTER COLUMN "avatar" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "AssignmentSubmission" ADD CONSTRAINT "AssignmentSubmission_fileObjectId_fkey" FOREIGN KEY ("fileObjectId") REFERENCES "FileObject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
