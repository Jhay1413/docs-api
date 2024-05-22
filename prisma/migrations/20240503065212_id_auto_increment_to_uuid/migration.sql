/*
  Warnings:

  - The primary key for the `Attachment` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `DocumentInfo` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `UserAccounts` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `UserInfo` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "DocumentHistory" DROP CONSTRAINT "DocumentHistory_documentId_fkey";

-- DropForeignKey
ALTER TABLE "DocumentHistory" DROP CONSTRAINT "DocumentHistory_recievedBy_fkey";

-- DropForeignKey
ALTER TABLE "DocumentInfo" DROP CONSTRAINT "DocumentInfo_createdBy_fkey";

-- DropForeignKey
ALTER TABLE "UserInfo" DROP CONSTRAINT "UserInfo_accountId_fkey";

-- AlterTable
ALTER TABLE "Attachment" DROP CONSTRAINT "Attachment_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Attachment_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Attachment_id_seq";

-- AlterTable
ALTER TABLE "DocumentHistory" ALTER COLUMN "documentId" SET DATA TYPE TEXT,
ALTER COLUMN "recievedBy" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "DocumentInfo" DROP CONSTRAINT "DocumentInfo_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "createdBy" SET DATA TYPE TEXT,
ADD CONSTRAINT "DocumentInfo_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "DocumentInfo_id_seq";

-- AlterTable
ALTER TABLE "UserAccounts" DROP CONSTRAINT "UserAccounts_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "UserAccounts_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "UserAccounts_id_seq";

-- AlterTable
ALTER TABLE "UserInfo" DROP CONSTRAINT "UserInfo_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "accountId" SET DATA TYPE TEXT,
ADD CONSTRAINT "UserInfo_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "UserInfo_id_seq";

-- AddForeignKey
ALTER TABLE "UserInfo" ADD CONSTRAINT "UserInfo_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "UserAccounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentInfo" ADD CONSTRAINT "DocumentInfo_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "UserAccounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentHistory" ADD CONSTRAINT "DocumentHistory_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "DocumentInfo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentHistory" ADD CONSTRAINT "DocumentHistory_recievedBy_fkey" FOREIGN KEY ("recievedBy") REFERENCES "UserAccounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
