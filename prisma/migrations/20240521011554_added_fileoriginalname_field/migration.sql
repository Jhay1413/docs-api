/*
  Warnings:

  - Added the required column `fileOriginalName` to the `Attachment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Attachment" ADD COLUMN     "fileOriginalName" TEXT NOT NULL;
