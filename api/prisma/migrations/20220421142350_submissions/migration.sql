/*
  Warnings:

  - You are about to drop the column `fileObjectId` on the `AssignmentSubmission` table. All the data in the column will be lost.
  - Added the required column `markdownData` to the `AssignmentSubmission` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "AssignmentSubmission" DROP CONSTRAINT "AssignmentSubmission_fileObjectId_fkey";

-- AlterTable
ALTER TABLE "AssignmentSubmission" DROP COLUMN "fileObjectId",
ADD COLUMN     "markdownData" TEXT NOT NULL;
