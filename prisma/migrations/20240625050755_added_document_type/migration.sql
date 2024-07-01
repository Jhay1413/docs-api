/*
  Warnings:

  - Added the required column `documentType` to the `Attachment` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "DocumentType" AS ENUM ('INITIAL_DOC', 'FOLLOWED_UP');

-- AlterTable
ALTER TABLE "Attachment" ADD COLUMN     "documentType" "DocumentType" NOT NULL;
