-- DropForeignKey
ALTER TABLE "ContactPerson" DROP CONSTRAINT "ContactPerson_companyId_fkey";

-- DropForeignKey
ALTER TABLE "ContactPerson" DROP CONSTRAINT "ContactPerson_companyProjectId_fkey";

-- AlterTable
ALTER TABLE "ContactPerson" ALTER COLUMN "companyId" DROP NOT NULL,
ALTER COLUMN "companyProjectId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "ContactPerson" ADD CONSTRAINT "ContactPerson_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContactPerson" ADD CONSTRAINT "ContactPerson_companyProjectId_fkey" FOREIGN KEY ("companyProjectId") REFERENCES "CompanyProject"("id") ON DELETE SET NULL ON UPDATE CASCADE;
