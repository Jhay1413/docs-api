/*
  Warnings:

  - You are about to drop the column `userId` on the `UserInfo` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "UserInfo_userId_key";

-- AlterTable
ALTER TABLE "UserInfo" DROP COLUMN "userId",
ADD COLUMN     "birthDate" TEXT NOT NULL DEFAULT '01-01-1900',
ADD COLUMN     "employeeId" TEXT NOT NULL DEFAULT '000000',
ADD COLUMN     "middleName" TEXT,
ALTER COLUMN "dateStarted" SET DATA TYPE TEXT;
