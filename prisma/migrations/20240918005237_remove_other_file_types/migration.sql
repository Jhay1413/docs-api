/*
  Warnings:

  - The values [FOR_ARCHIEVE,FOR_REVIEW] on the enum `FileType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "FileType_new" AS ENUM ('INITIAL_DOC', 'FOLLOWED_UP');
ALTER TABLE "Attachment" ALTER COLUMN "fileType" DROP DEFAULT;
ALTER TABLE "Attachment" ALTER COLUMN "fileType" TYPE "FileType_new" USING ("fileType"::text::"FileType_new");
ALTER TYPE "FileType" RENAME TO "FileType_old";
ALTER TYPE "FileType_new" RENAME TO "FileType";
DROP TYPE "FileType_old";
ALTER TABLE "Attachment" ALTER COLUMN "fileType" SET DEFAULT 'INITIAL_DOC';
COMMIT;
