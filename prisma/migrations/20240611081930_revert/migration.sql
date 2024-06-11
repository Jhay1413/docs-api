-- DropIndex
DROP INDEX "ContactPerson_companyId_key";

-- DropIndex
DROP INDEX "ContactPerson_companyProjectId_key";

-- AlterTable
ALTER TABLE "ContactPerson" ALTER COLUMN "companyId" DROP NOT NULL,
ALTER COLUMN "companyProjectId" DROP NOT NULL;
