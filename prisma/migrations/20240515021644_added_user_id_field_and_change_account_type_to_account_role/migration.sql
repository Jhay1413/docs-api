/*
  Warnings:

  - You are about to drop the column `accountType` on the `UserAccounts` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `UserInfo` will be added. If there are existing duplicate values, this will fail.
  - The required column `userId` was added to the `UserInfo` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "UserAccounts" DROP COLUMN "accountType",
ADD COLUMN     "accountRole" "Roles" NOT NULL DEFAULT 'USER';

-- AlterTable
ALTER TABLE "UserInfo" ADD COLUMN     "userId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "UserInfo_userId_key" ON "UserInfo"("userId");
