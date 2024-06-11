/*
  Warnings:

  - You are about to drop the column `lastName` on the `ContactPerson` table. All the data in the column will be lost.
  - You are about to drop the column `middleName` on the `ContactPerson` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ContactPerson" DROP COLUMN "lastName",
DROP COLUMN "middleName";
