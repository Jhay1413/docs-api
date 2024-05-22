/*
  Warnings:

  - Added the required column `documentSubType` to the `DocumentInfo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `team` to the `DocumentInfo` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "DocumentInfo" ADD COLUMN     "documentSubType" TEXT NOT NULL,
ADD COLUMN     "team" TEXT NOT NULL;
