/*
  Warnings:

  - Added the required column `documentSection` to the `DocumentInfo` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "Roles" ADD VALUE 'TL';
ALTER TYPE "Roles" ADD VALUE 'CH';

-- AlterTable
ALTER TABLE "DocumentInfo" ADD COLUMN     "documentSection" TEXT NOT NULL;
