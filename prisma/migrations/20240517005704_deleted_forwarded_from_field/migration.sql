/*
  Warnings:

  - You are about to drop the column `forwardedFrom` on the `DocumentHistory` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "DocumentHistory" DROP COLUMN "forwardedFrom";
