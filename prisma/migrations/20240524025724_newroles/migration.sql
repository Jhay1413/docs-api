-- AlterEnum
ALTER TYPE "Roles" ADD VALUE 'GUEST';

-- AlterTable
ALTER TABLE "UserInfo" ALTER COLUMN "assignedSection" DROP NOT NULL;
