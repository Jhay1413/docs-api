/*
  Warnings:

  - The values [USER] on the enum `Roles` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Roles_new" AS ENUM ('SUPERADMIN', 'ADMIN', 'TL', 'CH', 'GUEST');
ALTER TABLE "UserAccounts" ALTER COLUMN "accountRole" DROP DEFAULT;
ALTER TABLE "UserAccounts" ALTER COLUMN "accountRole" TYPE "Roles_new" USING ("accountRole"::text::"Roles_new");
ALTER TYPE "Roles" RENAME TO "Roles_old";
ALTER TYPE "Roles_new" RENAME TO "Roles";
DROP TYPE "Roles_old";
ALTER TABLE "UserAccounts" ALTER COLUMN "accountRole" SET DEFAULT 'GUEST';
COMMIT;
