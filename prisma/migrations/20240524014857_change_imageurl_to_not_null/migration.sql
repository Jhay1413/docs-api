/*
  Warnings:

  - Made the column `imageUrl` on table `UserInfo` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "UserInfo" ALTER COLUMN "imageUrl" SET NOT NULL;
