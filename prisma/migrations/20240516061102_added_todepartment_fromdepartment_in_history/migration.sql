/*
  Warnings:

  - You are about to drop the column `department` on the `DocumentHistory` table. All the data in the column will be lost.
  - Added the required column `fromDepartment` to the `DocumentHistory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `toDepartment` to the `DocumentHistory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "DocumentHistory" DROP COLUMN "department",
ADD COLUMN     "fromDepartment" TEXT NOT NULL,
ADD COLUMN     "toDepartment" TEXT NOT NULL;
