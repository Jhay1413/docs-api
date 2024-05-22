/*
  Warnings:

  - The primary key for the `DocumentHistory` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "Attachment" DROP CONSTRAINT "Attachment_historyId_fkey";

-- AlterTable
ALTER TABLE "Attachment" ALTER COLUMN "historyId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "DocumentHistory" DROP CONSTRAINT "DocumentHistory_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "DocumentHistory_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "DocumentHistory_id_seq";

-- AddForeignKey
ALTER TABLE "Attachment" ADD CONSTRAINT "Attachment_historyId_fkey" FOREIGN KEY ("historyId") REFERENCES "DocumentHistory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
