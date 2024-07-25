/*
  Warnings:

  - You are about to drop the `CompleteStaffWork` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SampleDB` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CompleteStaffWork" DROP CONSTRAINT "CompleteStaffWork_transactionId_fkey";

-- DropTable
DROP TABLE "CompleteStaffWork";

-- DropTable
DROP TABLE "SampleDB";
