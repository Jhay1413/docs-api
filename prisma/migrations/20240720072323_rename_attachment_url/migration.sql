/*
  Warnings:

  - You are about to drop the column `attachment` on the `CompleteStaffWork` table. All the data in the column will be lost.
  - Added the required column `attachmentUrl` to the `CompleteStaffWork` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CompleteStaffWork" DROP COLUMN "attachment",
ADD COLUMN     "attachmentUrl" TEXT NOT NULL;
