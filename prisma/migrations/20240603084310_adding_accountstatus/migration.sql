-- CreateEnum
CREATE TYPE "Status" AS ENUM ('ACTIVE', 'INACTIVE', 'DISABLE');

-- AlterTable
ALTER TABLE "UserAccounts" ADD COLUMN     "accountStatus" "Status" NOT NULL DEFAULT 'ACTIVE';
