/*
  Warnings:

  - You are about to drop the column `documentType` on the `Attachment` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "FileType" AS ENUM ('INITIAL_DOC', 'FOLLOWED_UP', 'FOR_ARCHIEVE', 'FOR_REVIEW');

-- AlterTable
ALTER TABLE "Attachment" DROP COLUMN "documentType",
ADD COLUMN     "fileStatus" TEXT,
ADD COLUMN     "fileType" "FileType" NOT NULL DEFAULT 'INITIAL_DOC',
ALTER COLUMN "fileUrl" DROP NOT NULL,
ALTER COLUMN "fileOriginalName" DROP NOT NULL;

-- DropEnum
DROP TYPE "DocumentType";
